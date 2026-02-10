import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { CacheTag } from "@/utils/cacheTags";
import { db } from "@/utils/firebase-admin";

export const getTotalTowersCount = cache(async () => {
    "use cache";
    cacheLife("days");
    cacheTag(CacheTag.TowersCount);

    const snap = await db.collection("towers").count().get();

    return snap.data().count;
});
