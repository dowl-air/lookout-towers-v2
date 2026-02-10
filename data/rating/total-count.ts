import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { CacheTag } from "@/utils/cacheTags";
import { db } from "@/utils/firebase-admin";

export const getTotalRatingsCount = cache(async () => {
    "use cache";
    cacheLife("days");
    cacheTag(CacheTag.RatingsCount);

    const snap = await db.collection("ratings").count().get();
    return snap.data().count;
});
