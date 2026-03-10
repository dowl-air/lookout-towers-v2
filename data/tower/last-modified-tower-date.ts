import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { CacheTag } from "@/utils/cacheTags";
import { db } from "@/utils/firebase-admin";
import { serializeFirestoreValue } from "@/utils/serializeFirestoreValue";

export const getLastModifiedTowerDate = cache(async () => {
    "use cache";
    cacheLife("days");
    cacheTag(CacheTag.LastChangeDate);

    const snap = await db.collection("towers").orderBy("modified", "desc").limit(1).get();
    if (snap.empty) return new Date().toISOString();

    const doc = snap.docs[0];
    const data = serializeFirestoreValue(doc.data()) as { modified?: string };
    return data.modified || new Date().toISOString();
});
