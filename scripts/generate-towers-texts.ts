import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { OpenRouter } from "@openrouter/sdk";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

import type { Tower } from "@/types/Tower";

const DEFAULT_MODEL = "openai/gpt-oss-120b:free";
const DEFAULT_OUTPUT_PATH = "scripts/output/generated-tower-texts.json";
const MAX_SOURCE_CHARS_PER_URL = 5_000;
const MAX_TOTAL_SOURCE_CHARS = 20_000;
const REQUEST_TIMEOUT_MS = 12_000;
const FIRESTORE_BATCH_LIMIT = 450;
const MAX_GENERATION_ATTEMPTS = 5;
const FORBIDDEN_HERO_PHRASES = ["navštivte", "objevte", "zažijte", "vydejte se"];
const HERO_DESCRIPTION_MAX_CHARS = 200;
const HERO_DESCRIPTION_MAX_SENTENCES = 2;
const SEO_DESCRIPTION_MIN_CHARS = 250;
const SEO_DESCRIPTION_MAX_CHARS = 420;
const MAX_COMPLETION_TOKENS = 900;

type GeneratedTowerTexts = {
    heroDescription: string;
    seoDescription: string;
};

type GeneratedTowerTextsResult = GeneratedTowerTexts & {
    fetchedUrls: string[];
    generatedAt: string;
    id: string;
    name: string;
    nameID: string;
    sourceWarnings: string[];
    validationWarnings: string[];
};

type CliOptions = {
    limit?: number;
    outputPath: string;
    towerId?: string;
    write: boolean;
};

function loadEnvFile() {
    const envPath = resolve(process.cwd(), ".env.local");

    if (!existsSync(envPath)) {
        return;
    }

    const envFile = readFileSync(envPath, "utf8");

    for (const line of envFile.split(/\r?\n/)) {
        const trimmedLine = line.trim();

        if (!trimmedLine || trimmedLine.startsWith("#")) {
            continue;
        }

        const separatorIndex = trimmedLine.indexOf("=");

        if (separatorIndex === -1) {
            continue;
        }

        const key = trimmedLine.slice(0, separatorIndex).trim();
        let value = trimmedLine.slice(separatorIndex + 1).trim();

        if (!key || process.env[key] !== undefined) {
            continue;
        }

        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }

        process.env[key] = value;
    }
}

function parseCliOptions(): CliOptions {
    const options: CliOptions = {
        outputPath: DEFAULT_OUTPUT_PATH,
        write: false,
    };

    const args = process.argv.slice(2);

    for (let index = 0; index < args.length; index += 1) {
        const arg = args[index];
        const nextArg = args[index + 1];

        if (arg === "--write") {
            options.write = true;
            continue;
        }

        if ((arg === "--limit" || arg === "-l") && nextArg) {
            const limit = Number.parseInt(nextArg, 10);

            if (Number.isNaN(limit) || limit <= 0) {
                throw new Error("--limit must be a positive number.");
            }

            options.limit = limit;
            index += 1;
            continue;
        }

        if ((arg === "--tower" || arg === "--tower-id") && nextArg) {
            options.towerId = nextArg;
            index += 1;
            continue;
        }

        if ((arg === "--output" || arg === "-o") && nextArg) {
            options.outputPath = nextArg;
            index += 1;
            continue;
        }

        throw new Error(`Unknown argument: ${arg}`);
    }

    return options;
}

function getRequiredEnv(name: string) {
    const value = process.env[name];

    if (!value) {
        throw new Error(
            `Missing ${name}. Add it to .env.local or export it before running this script.`
        );
    }

    return value;
}

function parsePrivateKey(value: string) {
    try {
        const parsed = JSON.parse(value) as { privateKey?: string } | string;
        return typeof parsed === "string" ? parsed : parsed.privateKey || value;
    } catch {
        return value.replace(/\\n/g, "\n");
    }
}

function createDb() {
    if (!getApps().length) {
        initializeApp({
            credential: cert({
                projectId: getRequiredEnv("GOOGLE_PROJECTID"),
                clientEmail: getRequiredEnv("GOOGLE_CLIENT_EMAIL"),
                privateKey: parsePrivateKey(getRequiredEnv("GOOGLE_PRIVATE_KEY")),
            }),
        });
    }

    return getFirestore();
}

function normalizeUrls(urls: Tower["urls"]) {
    if (!Array.isArray(urls)) {
        return [];
    }

    return [
        ...new Set(
            urls.filter((url): url is string => typeof url === "string" && url.startsWith("http"))
        ),
    ];
}

function stripHtml(html: string) {
    return html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ")
        .trim();
}

async function fetchUrlText(url: string) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(url, {
            headers: {
                "user-agent": "lookout-towers-text-generator/0.1",
            },
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const contentType = response.headers.get("content-type") || "";
        const rawText = await response.text();
        const text = contentType.includes("html")
            ? stripHtml(rawText)
            : rawText.replace(/\s+/g, " ").trim();

        return text.slice(0, MAX_SOURCE_CHARS_PER_URL);
    } finally {
        clearTimeout(timeout);
    }
}

async function fetchSourceTexts(urls: string[]) {
    const fetchedUrls: string[] = [];
    const sourceWarnings: string[] = [];
    const sourceParts: string[] = [];
    let remainingChars = MAX_TOTAL_SOURCE_CHARS;

    for (const url of urls) {
        if (remainingChars <= 0) {
            console.log(`  Source text budget reached, skipping remaining URLs.`);
            break;
        }

        try {
            console.log(`  Fetching source: ${url}`);
            const text = await fetchUrlText(url);

            if (!text) {
                sourceWarnings.push(`${url}: empty response`);
                console.warn(`  Source returned no usable text: ${url}`);
                continue;
            }

            fetchedUrls.push(url);
            sourceParts.push(`URL: ${url}\n${text.slice(0, remainingChars)}`);
            remainingChars -= text.length;
            console.log(`  Fetched ${text.length} chars from source.`);
        } catch (error) {
            sourceWarnings.push(
                `${url}: ${error instanceof Error ? error.message : "failed to fetch"}`
            );
            console.warn(
                `  Failed to fetch source: ${url} (${error instanceof Error ? error.message : "failed to fetch"})`
            );
        }
    }

    return {
        fetchedUrls,
        sourceText: sourceParts.join("\n\n"),
        sourceWarnings,
    };
}

function formatTowerFacts(tower: Tower) {
    return JSON.stringify(
        {
            id: tower.id,
            name: tower.name,
            type: tower.type,
            country: tower.country,
            province: tower.province,
            county: tower.county,
            elevation: tower.elevation,
            height: tower.height,
            viewHeight: tower.viewHeight,
            stairs: tower.stairs,
            material: tower.material,
            opened: tower.opened,
            owner: tower.owner,
            tags: tower.tags,
            sourceText: {
                history: tower.history,
                access: tower.access,
                locationText: tower.locationText,
                mapyczDescription: tower.mapycz?.description,
                viewText: tower.viewText,
            },
        },
        null,
        2
    );
}

function createPrompt(tower: Tower, sourceText: string, validationFeedback?: string) {
    return `${validationFeedback ? `NEJPRVE OPRAV TYTO CHYBY Z PŘEDCHOZÍHO POKUSU:\n${validationFeedback}\n\n` : ""}Vytvoř dva české texty pro detail rozhledny. Používej pouze doložené informace ze vstupních dat a zdrojů. Pokud zdroje neobsahují zajímavé informace, vytvoř faktický a neutrální text.

Výstup vrať jako validní JSON bez markdownu a bez komentáře:
{
  "heroDescription": "...",
  "seoDescription": "..."
}

Kontroluj délku znak po znaku. Výstup je platný pouze tehdy, když heroDescription má nejvýše 180 znaků a seoDescription má 250 až 400 znaků. Cílově piš heroDescription na 120 až 160 znaků a seoDescription na 280 až 330 znaků.

HERO DESCRIPTION:
- česky
- maximálně 180 znaků
- jedna přirozené souvětí, bez vykřičníků a otazníků
- ideálně 120 až 160 znaků
- nesmí působit jako reklama
- nepoužívej výzvy typu: navštivte, objevte, zažijte, vydejte se
- neopakuj běžné databázové údaje: výška rozhledny, počet schodů, nadmořská výška, GPS souřadnice, okres, kraj
- zaměř se na jedinečnost, historii, architekturu, konstrukci, okolí, charakter výhledu, příběh vzniku nebo význam místa
- pokud je známá zajímavost, preferuj ji před technickými parametry
- text musí znít přirozeně a lidsky

SEO DESCRIPTION:
- česky
- 250 až 400 znaků
- může obsahovat technické údaje
- shrň, co je to za rozhlednu, kde se nachází, zajímavosti, výhledy a základní parametry
- vhodné pro Google výsledky
- nesmí obsahovat neověřené informace
- přirozený jazyk
- spisovná čeština bez překlepů a jazykových chyb

DATA ROZHLEDNY:
${formatTowerFacts(tower)}

TEXTY ZE ZDROJOVÝCH STRÁNEK:
${sourceText || "Zdroje nejsou dostupné nebo neobsahují použitelný text."}`;
}

function parseGeneratedTexts(content: string): GeneratedTowerTexts {
    const trimmedContent = content.trim();
    const jsonStart = trimmedContent.indexOf("{");
    const jsonEnd = trimmedContent.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("AI response did not contain a JSON object.");
    }

    const parsed = JSON.parse(
        trimmedContent.slice(jsonStart, jsonEnd + 1)
    ) as Partial<GeneratedTowerTexts>;

    if (!parsed.heroDescription || !parsed.seoDescription) {
        throw new Error("AI response is missing heroDescription or seoDescription.");
    }

    return {
        heroDescription: parsed.heroDescription.trim(),
        seoDescription: parsed.seoDescription.trim(),
    };
}

function extractTextContent(content: unknown) {
    if (typeof content === "string") {
        return content.trim() || null;
    }

    if (!Array.isArray(content)) {
        return null;
    }

    const text = content
        .map((item) => {
            if (typeof item === "string") {
                return item;
            }

            if (item && typeof item === "object" && "text" in item) {
                const textValue = (item as { text?: unknown }).text;
                return typeof textValue === "string" ? textValue : "";
            }

            return "";
        })
        .join("")
        .trim();

    return text || null;
}

function describeEmptyResponse(response: unknown) {
    if (!response || typeof response !== "object") {
        return "response is not an object";
    }

    const chatResponse = response as {
        choices?: {
            finishReason?: unknown;
            index?: unknown;
            message?: {
                content?: unknown;
                refusal?: unknown;
                reasoning?: unknown;
                role?: unknown;
                toolCalls?: unknown;
            };
        }[];
        id?: unknown;
        model?: unknown;
        usage?: unknown;
    };
    const firstChoice = chatResponse.choices?.[0];
    const message = firstChoice?.message;
    const content = message?.content;
    const contentShape = Array.isArray(content) ? `array(${content.length})` : typeof content;

    return [
        `model=${String(chatResponse.model ?? "unknown")}`,
        `choiceIndex=${String(firstChoice?.index ?? "none")}`,
        `finishReason=${String(firstChoice?.finishReason ?? "none")}`,
        `messageRole=${String(message?.role ?? "none")}`,
        `contentShape=${contentShape}`,
        `contentIsEmpty=${content === null || content === undefined || content === ""}`,
        message?.refusal ? `refusal=${String(message.refusal)}` : null,
        message?.reasoning ? "reasoning=present" : null,
        Array.isArray(message?.toolCalls) ? `toolCalls=${message.toolCalls.length}` : null,
        chatResponse.usage ? `usage=${JSON.stringify(chatResponse.usage)}` : null,
    ]
        .filter(Boolean)
        .join(", ");
}

function countSentences(text: string) {
    return text.split(/[.!?]+/).filter((sentence) => sentence.trim().length > 0).length;
}

function countOccurrences(text: string, phrase: string) {
    return text.split(phrase).length - 1;
}

function validateGeneratedTexts(texts: GeneratedTowerTexts) {
    const warnings: string[] = [];
    const normalizedHeroDescription = texts.heroDescription.toLocaleLowerCase("cs-CZ");
    const heroDescriptionLength = texts.heroDescription.length;
    const heroDescriptionSentences = countSentences(texts.heroDescription);
    const seoDescriptionLength = texts.seoDescription.length;

    if (heroDescriptionLength > HERO_DESCRIPTION_MAX_CHARS) {
        warnings.push(
            `heroDescription length is ${heroDescriptionLength} chars, max is ${HERO_DESCRIPTION_MAX_CHARS}, exceeded by ${heroDescriptionLength - HERO_DESCRIPTION_MAX_CHARS}.`
        );
    }

    if (heroDescriptionSentences > HERO_DESCRIPTION_MAX_SENTENCES) {
        warnings.push(
            `heroDescription has ${heroDescriptionSentences} sentences, max is ${HERO_DESCRIPTION_MAX_SENTENCES}, exceeded by ${heroDescriptionSentences - HERO_DESCRIPTION_MAX_SENTENCES}.`
        );
    }

    for (const phrase of FORBIDDEN_HERO_PHRASES) {
        if (normalizedHeroDescription.includes(phrase)) {
            const occurrences = countOccurrences(normalizedHeroDescription, phrase);
            warnings.push(
                `heroDescription contains forbidden phrase "${phrase}" ${occurrences} time(s), expected 0.`
            );
        }
    }

    if (seoDescriptionLength < SEO_DESCRIPTION_MIN_CHARS) {
        warnings.push(
            `seoDescription length is ${seoDescriptionLength} chars, min is ${SEO_DESCRIPTION_MIN_CHARS}, missing ${SEO_DESCRIPTION_MIN_CHARS - seoDescriptionLength}.`
        );
    }

    if (seoDescriptionLength > SEO_DESCRIPTION_MAX_CHARS) {
        warnings.push(
            `seoDescription length is ${seoDescriptionLength} chars, max is ${SEO_DESCRIPTION_MAX_CHARS}, exceeded by ${seoDescriptionLength - SEO_DESCRIPTION_MAX_CHARS}.`
        );
    }

    return warnings;
}

async function getTowers(options: CliOptions) {
    const db = createDb();

    if (options.towerId) {
        const snap = await db.collection("towers").doc(options.towerId).get();

        if (!snap.exists) {
            throw new Error(`Tower ${options.towerId} was not found.`);
        }

        return [{ id: snap.id, ...(snap.data() as Omit<Tower, "id">) } as Tower];
    }

    let query = db.collection("towers").orderBy("name");

    if (options.limit) {
        query = query.limit(options.limit);
    }

    const snap = await query.get();

    return snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Tower, "id">) }) as Tower);
}

async function generateTextsForTower(
    openrouter: OpenRouter,
    tower: Tower
): Promise<GeneratedTowerTextsResult> {
    const urls = normalizeUrls(tower.urls);
    console.log(`  Fetching ${urls.length} source URL(s).`);
    const { fetchedUrls, sourceText, sourceWarnings } = await fetchSourceTexts(urls);
    console.log(
        `  Source fetching finished: ${fetchedUrls.length}/${urls.length} fetched, ${sourceWarnings.length} warning(s), ${sourceText.length} chars used.`
    );
    let lastValidationWarnings: string[] = [];
    let lastGeneratedTexts: GeneratedTowerTexts | null = null;

    for (let attempt = 1; attempt <= MAX_GENERATION_ATTEMPTS; attempt += 1) {
        const model = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
        const validationFeedback = lastValidationWarnings.length
            ? `${lastValidationWarnings.join("\n")}\n\nPředchozí výstup k přepracování, bez mechanického krácení:\n${JSON.stringify(lastGeneratedTexts, null, 2)}`
            : undefined;
        console.log(
            `  Generating texts with ${model}, attempt ${attempt}/${MAX_GENERATION_ATTEMPTS}.`
        );
        const response = await openrouter.chat.send({
            chatRequest: {
                model,
                messages: [
                    {
                        role: "user",
                        content: createPrompt(tower, sourceText, validationFeedback),
                    },
                ],
                maxCompletionTokens: MAX_COMPLETION_TOKENS,
                reasoning: {
                    effort: "minimal",
                },
                stream: false,
                temperature: 0.2,
            },
        });

        if (!("choices" in response)) {
            throw new Error("Expected a non-streaming OpenRouter chat response.");
        }

        const content = extractTextContent(response.choices[0]?.message?.content);

        if (!content) {
            lastValidationWarnings = [
                `AI response did not return text content: ${describeEmptyResponse(response)}.`,
            ];
            lastGeneratedTexts = null;
            console.warn(
                `Attempt ${attempt}/${MAX_GENERATION_ATTEMPTS} returned no text content for ${tower.name}:\n${lastValidationWarnings.map((warning) => `- ${warning}`).join("\n")}`
            );
            continue;
        }

        const generatedTexts = parseGeneratedTexts(content);
        const validationWarnings = validateGeneratedTexts(generatedTexts);

        if (!validationWarnings.length) {
            return {
                ...generatedTexts,
                fetchedUrls,
                generatedAt: new Date().toISOString(),
                id: tower.id,
                name: tower.name,
                nameID: tower.nameID,
                sourceWarnings,
                validationWarnings,
            };
        }

        lastValidationWarnings = validationWarnings;
        lastGeneratedTexts = generatedTexts;
        console.warn(
            `Attempt ${attempt}/${MAX_GENERATION_ATTEMPTS} failed validation for ${tower.name}:\n${validationWarnings.map((warning) => `- ${warning}`).join("\n")}`
        );
    }

    throw new Error(
        `Generated texts for ${tower.name} did not pass validation:\n${lastValidationWarnings.map((warning) => `- ${warning}`).join("\n")}`
    );
}

async function writeGeneratedTexts(results: GeneratedTowerTextsResult[]) {
    const db = createDb();

    for (let index = 0; index < results.length; index += FIRESTORE_BATCH_LIMIT) {
        const batch = db.batch();
        const chunk = results.slice(index, index + FIRESTORE_BATCH_LIMIT);

        for (const result of chunk) {
            batch.update(db.collection("towers").doc(result.id), {
                "texts.generatedAt": FieldValue.serverTimestamp(),
                "texts.heroDescription": result.heroDescription,
                "texts.seoDescription": result.seoDescription,
            });
        }

        await batch.commit();
    }
}

function saveResults(outputPath: string, results: GeneratedTowerTextsResult[]) {
    const absoluteOutputPath = resolve(process.cwd(), outputPath);
    mkdirSync(dirname(absoluteOutputPath), { recursive: true });
    writeFileSync(absoluteOutputPath, `${JSON.stringify(results, null, 2)}\n`, "utf8");

    return absoluteOutputPath;
}

async function main() {
    loadEnvFile();

    const options = parseCliOptions();
    const openrouter = new OpenRouter({
        apiKey: getRequiredEnv("OPENROUTER_API_KEY"),
    });
    const towers = await getTowers(options);
    const results: GeneratedTowerTextsResult[] = [];

    console.log(`Generating tower texts for ${towers.length} tower(s).`);

    for (const [index, tower] of towers.entries()) {
        console.log(`[${index + 1}/${towers.length}] ${tower.name}`);
        results.push(await generateTextsForTower(openrouter, tower));
    }

    const savedPath = saveResults(options.outputPath, results);

    if (options.write) {
        await writeGeneratedTexts(results);
        console.log(`Updated ${results.length} tower document(s) in Firestore.`);
    }

    console.log(`Saved generated texts to ${savedPath}.`);
}

void main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "Tower text generation failed.");
    process.exitCode = 1;
});
