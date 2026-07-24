import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { OpenRouter } from "@openrouter/sdk";

const envPath = resolve(process.cwd(), ".env.local");

if (existsSync(envPath)) {
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

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
    console.error(
        "Missing OPENROUTER_API_KEY. Add it to .env.local or export it before running npm run ai-test."
    );
    process.exitCode = 1;
    process.exit();
}

const openrouter = new OpenRouter({
    apiKey,
});

async function main() {
    const response = await openrouter.chat.send({
        chatRequest: {
            model: "nex-agi/nex-n2-pro:free",
            messages: [
                {
                    role: "user",
                    content: "Jaký je smysl života?",
                },
            ],
            stream: false,
        },
    });

    if (!("choices" in response)) {
        throw new Error("Expected a non-streaming OpenRouter chat response.");
    }

    console.log(response.choices[0]?.message?.content ?? "No response content returned.");
}

void main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "AI request failed.");
    process.exitCode = 1;
});
