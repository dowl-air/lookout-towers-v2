import { createInterface } from "node:readline/promises";
import { pathToFileURL } from "node:url";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldPath, FieldValue, getFirestore } from "firebase-admin/firestore";

import { AdmissionType, type Admission } from "@/types/Admission";
import { OpeningHoursType, type OpeningHours } from "@/types/OpeningHours";
import type { Tower, TowerContact } from "@/types/Tower";
import { SITE_URL } from "@/utils/constants";

import { scrapeDetailPage, type ScrapedTowerDocument } from "./scrape_add_tower";

const DEFAULT_LIMIT = 10;
const DEFAULT_WAIT_TIME_SECONDS = 10;
const ANSI = {
    blue: "\u001B[34m",
    cyan: "\u001B[36m",
    dim: "\u001B[90m",
    green: "\u001B[32m",
    magenta: "\u001B[35m",
    red: "\u001B[31m",
    reset: "\u001B[0m",
    yellow: "\u001B[33m",
} as const;

type MapyCzReference = {
    id?: string;
    source?: string;
};

type StoredOpeningHours = OpeningHours & {
    forbidden_type?: number;
};

type SyncTower = Pick<Tower, "id" | "name"> & {
    admission?: Admission;
    contact?: TowerContact;
    elevation?: number | null;
    height?: number;
    mapycz?: MapyCzReference;
    material?: string[];
    opened?: unknown;
    openingHours?: StoredOpeningHours;
    owner?: string;
    stairs?: number;
};

type MapyUpdatePayload = Partial<
    Pick<
        Tower,
        | "admission"
        | "contact"
        | "elevation"
        | "height"
        | "material"
        | "opened"
        | "openingHours"
        | "owner"
        | "stairs"
    >
>;

type ScrapedMapyFields = Pick<
    ScrapedTowerDocument,
    | "admission"
    | "contact"
    | "elevation"
    | "height"
    | "material"
    | "opened"
    | "openingHours"
    | "owner"
    | "stairs"
>;

export type CliOptions = {
    auto: boolean;
    limit: number;
    startIndex: number;
    waitTimeSeconds: number;
    write: boolean;
};

type LogColor = keyof typeof ANSI;

export function formatLogMessage(message: string, color: Exclude<LogColor, "reset">) {
    return `${ANSI.dim}[towers_mapy_sync] ${ANSI[color]}${message}${ANSI.reset}`;
}

function log(message: string, color: Exclude<LogColor, "reset">) {
    console.error(formatLogMessage(message, color));
}

export function formatIndexedTowerLabel(tower: Pick<SyncTower, "id" | "name">, index: number) {
    return `[${index}] ${tower.name} (${tower.id})`;
}

function formatError(error: unknown) {
    return error instanceof Error ? error.message : "Unknown error";
}

function parseNonNegativeInteger(value: string, optionName: string) {
    const parsed = Number(value);

    if (!Number.isSafeInteger(parsed) || parsed < 0) {
        throw new Error(`${optionName} must be a non-negative integer.`);
    }

    return parsed;
}

function parsePositiveInteger(value: string, optionName: string) {
    const parsed = Number(value);

    if (!Number.isSafeInteger(parsed) || parsed < 1) {
        throw new Error(`${optionName} must be a positive integer.`);
    }

    return parsed;
}

export function parseCliOptions(args = process.argv.slice(2)): CliOptions {
    const options: CliOptions = {
        auto: false,
        limit: DEFAULT_LIMIT,
        startIndex: 0,
        waitTimeSeconds: DEFAULT_WAIT_TIME_SECONDS,
        write: false,
    };

    for (let index = 0; index < args.length; index += 1) {
        const argument = args[index];
        const value = args[index + 1];

        if (argument === "--auto") {
            options.auto = true;
            continue;
        }

        if (argument === "--write") {
            options.write = true;
            continue;
        }

        if (argument === "--start-index") {
            options.startIndex = parseNonNegativeInteger(value ?? "", argument);
            index += 1;
            continue;
        }

        if (argument === "--limit") {
            options.limit = parsePositiveInteger(value ?? "", argument);
            index += 1;
            continue;
        }

        if (argument === "--wait") {
            options.waitTimeSeconds = parsePositiveInteger(value ?? "", argument);
            index += 1;
            continue;
        }

        throw new Error(`Unknown or incomplete argument: ${argument}`);
    }

    return options;
}

function loadLocalEnv() {
    try {
        process.loadEnvFile(`${process.cwd()}/.env.local`);
    } catch (error) {
        if (!(error instanceof Error) || !error.message.includes("ENOENT")) {
            throw error;
        }
    }
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

function getFirestoreDatabase() {
    const appName = "towers-mapy-sync";
    const app =
        getApps().find((candidate) => candidate.name === appName) ??
        initializeApp(
            {
                credential: cert({
                    clientEmail: getRequiredEnv("GOOGLE_CLIENT_EMAIL"),
                    privateKey: parsePrivateKey(getRequiredEnv("GOOGLE_PRIVATE_KEY")),
                    projectId: getRequiredEnv("GOOGLE_PROJECTID"),
                }),
            },
            appName
        );

    return getFirestore(app);
}

function hasContactValue(contact: TowerContact | undefined) {
    return Boolean(contact?.email || contact?.officialWebsite || contact?.phone);
}

function normalizeComparableValue(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(normalizeComparableValue);

    if (typeof value === "object" && value !== null) {
        return Object.fromEntries(
            Object.entries(value)
                .sort(([firstKey], [secondKey]) => firstKey.localeCompare(secondKey))
                .map(([key, item]) => [key, normalizeComparableValue(item)])
        );
    }

    return value;
}

function areValuesEqual(first: unknown, second: unknown) {
    return (
        JSON.stringify(normalizeComparableValue(first)) ===
        JSON.stringify(normalizeComparableValue(second))
    );
}

export function stripUtmParameters(value: string) {
    try {
        const url = new URL(value);
        let removedUtmParameter = false;

        for (const key of [...url.searchParams.keys()]) {
            if (key.toLocaleLowerCase("en-US").startsWith("utm_")) {
                url.searchParams.delete(key);
                removedUtmParameter = true;
            }
        }

        return removedUtmParameter ? url.toString() : value;
    } catch {
        return value;
    }
}

function mergeContact(existing: TowerContact | undefined, scraped: TowerContact): TowerContact {
    return {
        email: scraped.email || existing?.email || "",
        officialWebsite: stripUtmParameters(
            scraped.officialWebsite || existing?.officialWebsite || ""
        ),
        phone: scraped.phone || existing?.phone || "",
    };
}

function mergeOpeningHours(
    existing: StoredOpeningHours | undefined,
    scraped: OpeningHours
): OpeningHours {
    return {
        ...scraped,
        ...(scraped.detailText || !existing?.detailText ? {} : { detailText: existing.detailText }),
        ...(scraped.detailUrl || !existing?.detailUrl ? {} : { detailUrl: existing.detailUrl }),
    };
}

export function getMissingMapyUpdates(
    tower: Pick<
        SyncTower,
        | "admission"
        | "contact"
        | "elevation"
        | "height"
        | "material"
        | "opened"
        | "openingHours"
        | "owner"
        | "stairs"
    >,
    scraped: ScrapedMapyFields
): MapyUpdatePayload {
    const updates: MapyUpdatePayload = {};

    if (
        scraped.openingHours?.type !== undefined &&
        scraped.openingHours.type !== OpeningHoursType.Unknown &&
        (!tower.openingHours || tower.openingHours.type === OpeningHoursType.Unknown)
    ) {
        updates.openingHours = mergeOpeningHours(tower.openingHours, scraped.openingHours);
    }

    if (
        scraped.admission?.type !== undefined &&
        scraped.admission.type !== AdmissionType.UNKNOWN &&
        tower.admission?.type !== scraped.admission.type
    ) {
        updates.admission = {
            ...scraped.admission,
            ...(tower.admission?.tariffes ? { tariffes: tower.admission.tariffes } : {}),
        };
    }

    if (scraped.height !== undefined && (tower.height === undefined || tower.height === 0)) {
        updates.height = scraped.height;
    }
    if (scraped.opened !== undefined && (tower.opened === undefined || tower.opened === null)) {
        updates.opened = scraped.opened;
    }
    if (
        scraped.elevation !== undefined &&
        (tower.elevation === undefined ||
            tower.elevation === null ||
            tower.elevation === 0 ||
            tower.elevation === 1)
    ) {
        updates.elevation = scraped.elevation;
    }
    if (scraped.stairs !== undefined && tower.stairs !== scraped.stairs)
        updates.stairs = scraped.stairs;

    if (
        scraped.material &&
        scraped.material.length > 0 &&
        !areValuesEqual(tower.material, scraped.material)
    ) {
        updates.material = scraped.material;
    }

    if (scraped.owner && tower.owner !== scraped.owner) updates.owner = scraped.owner;
    if (scraped.contact && hasContactValue(scraped.contact)) {
        const contact = mergeContact(tower.contact, scraped.contact);

        if (!areValuesEqual(tower.contact, contact)) updates.contact = contact;
    }

    return updates;
}

function getSyncTower(id: string, data: Record<string, unknown>): SyncTower | null {
    if (typeof data.name !== "string") return null;

    const elevation = data.elevation;
    const normalizedElevation: number | null | undefined =
        elevation === null ? null : typeof elevation === "number" ? elevation : undefined;
    const mapycz =
        typeof data.mapycz === "object" && data.mapycz !== null
            ? (data.mapycz as MapyCzReference)
            : undefined;

    return {
        admission: data.admission as Admission | undefined,
        contact: data.contact as TowerContact | undefined,
        elevation: normalizedElevation,
        height: typeof data.height === "number" ? data.height : undefined,
        id,
        mapycz,
        material: Array.isArray(data.material) ? (data.material as string[]) : undefined,
        name: data.name,
        opened: data.opened,
        openingHours: data.openingHours as StoredOpeningHours | undefined,
        owner: typeof data.owner === "string" ? data.owner : undefined,
        stairs: typeof data.stairs === "number" ? data.stairs : undefined,
    };
}

function createMapyComUrl(mapycz: MapyCzReference) {
    if (!mapycz.id || !mapycz.source) return null;

    const searchParams = new URLSearchParams({ id: mapycz.id, source: mapycz.source });
    return `https://mapy.com/cs/turisticka?${searchParams.toString()}`;
}

export function createTowerPurgeUrl(towerId: string, appUrl = SITE_URL) {
    return new URL(`/api/cache/purge/${encodeURIComponent(towerId)}`, appUrl).toString();
}

async function purgeTowerCache(towerId: string) {
    const appUrl = process.env.MAPY_TOWERS_SYNC_APP_URL ?? SITE_URL;
    const response = await fetch(createTowerPurgeUrl(towerId, appUrl), { method: "POST" });

    if (!response.ok) {
        throw new Error(`Tower cache purge failed with HTTP ${response.status}.`);
    }
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

export function formatUpdateValues(values: object) {
    const compactValues = Object.fromEntries(
        Object.entries(values).map(([key, value]) => {
            if (key !== "openingHours" || !isRecord(value) || !("ranges" in value)) {
                return [key, value];
            }

            return [key, { ...value, ranges: "(...)" }];
        })
    );

    return JSON.stringify(compactValues, null, 2).replace('"ranges": "(...)"', '"ranges": (...)');
}

function isBareUnknownOpeningHours(value: unknown) {
    return (
        isRecord(value) &&
        Object.keys(value).length === 1 &&
        value.type === OpeningHoursType.Unknown
    );
}

export function getPreviousUpdateValues(
    tower: Pick<
        SyncTower,
        | "admission"
        | "contact"
        | "elevation"
        | "height"
        | "material"
        | "opened"
        | "openingHours"
        | "owner"
        | "stairs"
    >,
    updates: MapyUpdatePayload
) {
    const currentValues = tower as Record<string, unknown>;

    return Object.fromEntries(
        Object.keys(updates).flatMap((key) =>
            currentValues[key] === undefined ||
            (key === "openingHours" && isBareUnknownOpeningHours(currentValues[key]))
                ? []
                : [[key, currentValues[key]]]
        )
    );
}

async function confirm(question: string, prompt: ReturnType<typeof createInterface>) {
    const answer = (await prompt.question(`${question} [y/N] `)).trim().toLocaleLowerCase("cs");
    return answer === "y" || answer === "yes" || answer === "a" || answer === "ano";
}

async function pause(question: string, prompt: ReturnType<typeof createInterface>) {
    await prompt.question(`${question} Press Enter to continue. `);
}

async function main() {
    loadLocalEnv();
    const options = parseCliOptions();
    const firestore = getFirestoreDatabase();
    const snapshot = await firestore
        .collection("towers")
        .orderBy(FieldPath.documentId())
        .offset(options.startIndex)
        .limit(options.limit)
        .get();
    const towers = snapshot.docs.flatMap((document, batchIndex) => {
        const tower = getSyncTower(document.id, document.data());
        return tower ? [{ batchIndex, tower }] : [];
    });
    const prompt = createInterface({ input: process.stdin, output: process.stdout });
    let updated = 0;

    log(
        `Processing ${towers.length} towers from index ${options.startIndex} with a limit of ${options.limit} ${options.write ? "with writes enabled" : "in dry-run mode"}${options.auto ? " in auto mode" : ""}.`,
        "cyan"
    );

    try {
        for (const { batchIndex, tower } of towers) {
            const towerLabel = formatIndexedTowerLabel(tower, options.startIndex + batchIndex);
            const mapyUrl = tower.mapycz ? createMapyComUrl(tower.mapycz) : null;

            if (!mapyUrl) {
                log(`${towerLabel}: Mapy.com source or ID is missing.`, "yellow");
                if (!options.auto) await pause("No Mapy.com detail can be scraped.", prompt);
                continue;
            }

            log(`${towerLabel}: scraping ${mapyUrl}`, "blue");
            let scraped: ScrapedTowerDocument;

            try {
                scraped = await scrapeDetailPage(mapyUrl, options.waitTimeSeconds, {
                    includeGalleryPhotos: false,
                    resolveGeography: false,
                    resolveNameId: false,
                });
            } catch (error) {
                log(`${towerLabel}: scraping failed: ${formatError(error)}`, "red");
                if (!options.auto) await pause("No update can be proposed.", prompt);
                continue;
            }

            const updates = getMissingMapyUpdates(tower, scraped);
            const updateCount = Object.keys(updates).length;

            if (updateCount === 0) {
                log(`${towerLabel}: no usable Mapy.com value differs from the database.`, "yellow");
                if (!options.auto) await pause("No update can be proposed.", prompt);
                continue;
            }

            log(`${towerLabel}: proposed updates:\n${formatUpdateValues(updates)}`, "blue");
            const previousValues = getPreviousUpdateValues(tower, updates);

            if (Object.keys(previousValues).length > 0) {
                log(
                    `${towerLabel}: previous values:\n${formatUpdateValues(previousValues)}`,
                    "magenta"
                );
            }
            const approved = options.auto || (await confirm("Apply these updates?", prompt));

            if (!approved) {
                log(`${towerLabel}: skipped.`, "dim");
                continue;
            }

            if (!options.write) {
                log(`${towerLabel}: dry run; use --write to save these fields.`, "yellow");
                continue;
            }

            await firestore
                .collection("towers")
                .doc(tower.id)
                .update({
                    ...updates,
                    modified: FieldValue.serverTimestamp(),
                });
            await purgeTowerCache(tower.id);
            updated += 1;
            log(`${towerLabel}: saved ${updateCount} fields and purged cache.`, "green");
        }
    } finally {
        prompt.close();
    }

    log(`Finished: ${updated} towers updated.`, options.write ? "green" : "cyan");
}

const isExecutedDirectly =
    process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isExecutedDirectly) {
    void main().catch((error: unknown) => {
        console.error(formatLogMessage(`Failed: ${formatError(error)}`, "red"));
        process.exitCode = 1;
    });
}
