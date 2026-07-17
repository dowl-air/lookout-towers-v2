import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import type { ScrapedTower } from "@/types/Tower";
import { CacheTag } from "@/utils/cacheTags";
import { db } from "@/utils/firebase-admin";
import { serializeFirestoreValue } from "@/utils/serializeFirestoreValue";

export const getReadyScrapedTowers = cache(async (): Promise<ScrapedTower[]> => {
    "use cache";
    cacheLife("minutes");
    cacheTag(CacheTag.ScrapedTowers);

    const snapshot = await db
        .collection("towers_scraped")
        .where("status", "==", "ready")
        .limit(100)
        .get();

    return snapshot.docs.map(
        (document) =>
            serializeFirestoreValue({ id: document.id, ...document.data() }) as ScrapedTower
    );
});
