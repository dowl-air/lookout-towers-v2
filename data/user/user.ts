import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { verifyUser } from "@/data/auth";
import { User } from "@/types/User";
import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";
import { db } from "@/utils/firebase-admin";

export const getCurrentUser = cache(async () => {
    "use cache: private";
    cacheLife("hours");

    const { userId } = await verifyUser();
    if (!userId) return null;

    cacheTag(CacheTag.User);
    cacheTag(getCacheTagSpecific(CacheTag.User, userId));

    try {
        const userSnap = await db.collection("users").doc(userId).get();
        if (!userSnap.exists) return null;

        const data = userSnap.data();
        const user: User = {
            id: userSnap.id,
            name: data.name,
            email: data.email,
            image: data.image,
        };

        return user;
    } catch (error) {
        console.log("Error fetching user data:", error);
        return null;
    }
});

export const getUserById = cache(async (id: string) => {
    "use cache";
    cacheLife("hours");
    cacheTag(CacheTag.User);
    cacheTag(getCacheTagSpecific(CacheTag.User, id));

    try {
        const userSnap = await db.collection("users").doc(id).get();
        if (!userSnap.exists) return null;

        const data = userSnap.data();
        const user: User = {
            id: userSnap.id,
            name: data.name,
            email: data.email,
            image: data.image,
        };

        return user;
    } catch (error) {
        console.log("Error fetching user data:", error);
        return null;
    }
});
