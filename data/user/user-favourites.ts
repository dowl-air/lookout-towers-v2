import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { checkUser } from "@/data/auth";
import { CacheTag, getCacheTagSpecific, getCacheTagUserSpecific } from "@/utils/cacheTags";
import { db } from "@/utils/firebase-admin";

export const checkFavourite = cache(async (towerID: string): Promise<boolean> => {
    "use cache: private";
    cacheLife("hours");

    const { userId } = await checkUser();
    if (!userId) {
        return false;
    }

    cacheTag(CacheTag.TowerFavourite);
    cacheTag(getCacheTagUserSpecific(CacheTag.TowerFavourite, userId, towerID));

    const snap = await db.collection("favourites").doc(`${userId}_${towerID}`).get();
    return snap.exists;
});

export const getAllUserFavouritesIds = cache(async (): Promise<string[]> => {
    "use cache: private";
    cacheLife("hours");

    const { userId } = await checkUser();
    if (!userId) {
        return [];
    }

    cacheTag(CacheTag.UserFavourites);
    cacheTag(getCacheTagSpecific(CacheTag.UserFavourites, userId));

    const snap = await db.collection("favourites").where("user_id", "==", userId).get();
    return snap.docs.map((doc) => doc.data().tower_id);
});
