import "server-only";

import { Timestamp } from "firebase-admin/firestore";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { CacheTag } from "@/utils/cacheTags";
import { db } from "@/utils/firebase-admin";

export const getLastModifiedTowerDate = cache(async () => {
    "use cache";
    cacheLife("days");
    cacheTag(CacheTag.LastChangeDate);

    const snap = await db.collection("towers").orderBy("modified", "desc").limit(1).get();
    if (snap.empty) return new Date().toISOString();

    const doc = snap.docs[0];
    const data = doc.data();
    return (data.modified as Timestamp).toDate().toISOString();
});
