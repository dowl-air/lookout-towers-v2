import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { checkUser } from "@/data/auth";
import { getUserById } from "@/data/user/user";
import { Rating } from "@/types/Rating";
import { CacheTag, getCacheTagSpecific, getCacheTagUserSpecific } from "@/utils/cacheTags";
import { db } from "@/utils/firebase-admin";
import { serializeFirestoreValue } from "@/utils/serializeFirestoreValue";

const normalizeRating = (data: any): Rating =>
    ({
        ...(serializeFirestoreValue(data) as Record<string, unknown>),
    }) as Rating;

export const getUserRating = cache(async (towerID: string): Promise<Rating | null> => {
    "use cache: private";
    cacheLife("hours");

    const { userId } = await checkUser();
    if (!userId) {
        return null;
    }

    cacheTag(CacheTag.UserTowerRating);
    cacheTag(getCacheTagUserSpecific(CacheTag.UserTowerRating, userId, towerID));

    const [snap, user] = await Promise.all([
        db.collection("ratings").doc(`${userId}_${towerID}`).get(),
        getUserById(userId),
    ]);

    if (!snap.exists) {
        return null;
    }

    return {
        ...normalizeRating(snap.data()),
        user,
    };
});

export const getTowerRatings = cache(async (towerID: string): Promise<Rating[]> => {
    "use cache";
    cacheLife("hours");
    cacheTag(CacheTag.TowerRatings);
    cacheTag(getCacheTagSpecific(CacheTag.TowerRatings, towerID));

    const snap = await db.collection("ratings").where("tower_id", "==", towerID).get();
    return snap.docs.map((doc) => normalizeRating(doc.data()));
});

export const getAllUserRatings = cache(async (): Promise<Rating[]> => {
    "use cache: private";
    cacheLife("hours");

    const { userId } = await checkUser();
    if (!userId) {
        return [];
    }

    cacheTag(CacheTag.UserRatings);
    cacheTag(getCacheTagSpecific(CacheTag.UserRatings, userId));

    const snap = await db.collection("ratings").where("user_id", "==", userId).get();
    return snap.docs.map((doc) => normalizeRating(doc.data()));
});
