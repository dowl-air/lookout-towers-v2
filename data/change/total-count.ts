import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { CacheTag } from "@/utils/cacheTags";
import { db } from "@/utils/firebase-admin";

export const getTotalChangesCount = cache(async () => {
    "use cache";
    cacheLife("days");
    cacheTag(CacheTag.ChangesCount);

    const snap = await db.collection("changes").count().get();
    return snap.data().count;
});
