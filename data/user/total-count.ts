import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { CacheTag } from "@/utils/cacheTags";
import { db } from "@/utils/firebase-admin";

export const getTotalUsersCount = cache(async () => {
    "use cache";
    cacheLife("days");
    cacheTag(CacheTag.UsersCount);

    const snap = await db.collection("users").count().get();
    return snap.data().count;
});
