import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { checkAdmin } from "@/actions/checkAdmin";
import { CacheTag } from "@/utils/cacheTags";
import { db } from "@/utils/firebase-admin";
import { serializeFirestoreValue } from "@/utils/serializeFirestoreValue";

export type AdminUser = {
    email: string;
    id: string;
    image?: string;
    name: string;
};

export const getAdminUsers = cache(async (): Promise<AdminUser[]> => {
    "use cache: private";
    cacheLife("hours");
    cacheTag(CacheTag.UsersCommunity);

    if (!(await checkAdmin())) {
        throw new Error("Unauthorized.");
    }

    const snapshot = await db.collection("users").orderBy("name").get();

    return snapshot.docs.map((document) => {
        const data = serializeFirestoreValue(document.data()) as Record<string, unknown>;

        return {
            email: typeof data.email === "string" ? data.email : "",
            id: document.id,
            image: typeof data.image === "string" ? data.image : undefined,
            name: typeof data.name === "string" ? data.name : "Uživatel",
        };
    });
});
