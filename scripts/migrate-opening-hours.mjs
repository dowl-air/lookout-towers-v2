import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const OpeningHoursType = {
    Unknown: 0,
    NonStop: 1,
    Occasionally: 2,
    SomeMonths: 3,
    Forbidden: 4,
    WillOpen: 5,
    EveryMonth: 6,
};

const isDryRun = !process.argv.includes("--write");
const DEFAULT_CACHE_PURGE_BASE_URL = "http://127.0.0.1:3000";

const parseEnvValue = (value) => {
    const trimmedValue = value.trim();
    const quote = trimmedValue.at(0);

    if ((quote === '"' || quote === "'") && trimmedValue.at(-1) === quote) {
        return trimmedValue.slice(1, -1);
    }

    return trimmedValue;
};

const loadLocalEnv = () => {
    const envPath = resolve(process.cwd(), ".env.local");
    if (!existsSync(envPath)) return;

    readFileSync(envPath, "utf8")
        .split(/\r?\n/)
        .forEach((line) => {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine.startsWith("#")) return;

            const separatorIndex = trimmedLine.indexOf("=");
            if (separatorIndex === -1) return;

            const key = trimmedLine.slice(0, separatorIndex).trim();
            const value = parseEnvValue(trimmedLine.slice(separatorIndex + 1));

            if (!key || process.env[key] !== undefined) return;

            process.env[key] = value;
        });
};

const getCachePurgeBaseUrl = () => {
    return (
        process.env.OPENING_HOURS_MIGRATION_CACHE_PURGE_BASE_URL ||
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.NEXTAUTH_URL ||
        process.env.AUTH_URL ||
        DEFAULT_CACHE_PURGE_BASE_URL
    ).replace(/\/$/, "");
};

const purgeTowerCache = async (towerID) => {
    const url = new URL(`/api/cache/purge/${encodeURIComponent(towerID)}`, getCachePurgeBaseUrl());
    const response = await fetch(url, {
        method: "POST",
    });

    if (!response.ok) {
        const responseText = await response.text();
        throw new Error(
            `Failed to purge cache for ${towerID}. Status: ${response.status}. Response: ${responseText}`
        );
    }
};

const parsePrivateKey = () => {
    if (!process.env.GOOGLE_PRIVATE_KEY) {
        throw new Error("Missing GOOGLE_PRIVATE_KEY environment variable.");
    }

    return JSON.parse(process.env.GOOGLE_PRIVATE_KEY).privateKey;
};

const initializeFirebase = () => {
    if (getApps().length) return;

    initializeApp({
        credential: cert({
            projectId: process.env.GOOGLE_PROJECTID,
            clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
            privateKey: parsePrivateKey(),
        }),
    });
};

const getOpeningHoursTypeFromRanges = (ranges) => {
    const coveredMonths = new Set();

    ranges.forEach((range) => {
        for (let month = range.monthFrom; month <= range.monthTo; month += 1) {
            coveredMonths.add(month);
        }
    });

    return coveredMonths.size === 12 ? OpeningHoursType.EveryMonth : OpeningHoursType.SomeMonths;
};

const hasRangeData = (openingHours) => {
    return openingHours && Array.isArray(openingHours.ranges) && openingHours.ranges.length > 0;
};

const hasLegacyRangeData = (openingHours) => {
    return (
        openingHours &&
        [OpeningHoursType.SomeMonths, OpeningHoursType.EveryMonth].includes(openingHours.type) &&
        Array.isArray(openingHours.days) &&
        typeof openingHours.dayFrom === "number" &&
        typeof openingHours.dayTo === "number"
    );
};

const createRange = (openingHours) => ({
    monthFrom: openingHours.type === OpeningHoursType.EveryMonth ? 0 : openingHours.monthFrom,
    monthTo: openingHours.type === OpeningHoursType.EveryMonth ? 11 : openingHours.monthTo,
    days: openingHours.days,
    dayFrom: openingHours.dayFrom,
    dayTo: openingHours.dayTo,
    ...(openingHours.lunchBreak
        ? {
              lunchBreak: openingHours.lunchBreak,
              lunchFrom: openingHours.lunchFrom,
              lunchTo: openingHours.lunchTo,
          }
        : {}),
});

const migrateOpeningHours = (openingHours) => {
    if (!openingHours || hasRangeData(openingHours) || !hasLegacyRangeData(openingHours)) {
        return null;
    }

    const range = createRange(openingHours);
    const migrated = {
        ...openingHours,
        ranges: [range],
        type: getOpeningHoursTypeFromRanges([range]),
    };

    delete migrated.monthFrom;
    delete migrated.monthTo;
    delete migrated.days;
    delete migrated.dayFrom;
    delete migrated.dayTo;
    delete migrated.lunchBreak;
    delete migrated.lunchFrom;
    delete migrated.lunchTo;

    if (migrated.note && !migrated.detailText) {
        migrated.detailText = migrated.note;
    }
    delete migrated.note;

    return migrated;
};

loadLocalEnv();
initializeFirebase();

const db = getFirestore();
const snapshot = await db.collection("towers").get();
const batch = db.batch();
let migratedCount = 0;
const migratedTowerIds = [];

snapshot.docs.forEach((documentSnapshot) => {
    const data = documentSnapshot.data();
    const migratedOpeningHours = migrateOpeningHours(data.openingHours);

    if (!migratedOpeningHours) return;

    migratedCount += 1;
    migratedTowerIds.push(documentSnapshot.id);
    console.log(
        `${isDryRun ? "Would migrate" : "Migrating"} ${documentSnapshot.id} (${data.name ?? "unknown tower"})`
    );

    if (!isDryRun) {
        batch.update(documentSnapshot.ref, {
            openingHours: migratedOpeningHours,
        });
    }
});

if (!isDryRun && migratedCount > 0) {
    await batch.commit();

    for (const towerID of migratedTowerIds) {
        await purgeTowerCache(towerID);
        console.log(`Purged cache for ${towerID}`);
    }
}

console.log(
    `${isDryRun ? "Dry run complete" : "Migration complete"}. Towers affected: ${migratedCount}`
);
console.log(isDryRun ? "Run npm run migrate:opening-hours -- --write to apply changes." : "Done.");
