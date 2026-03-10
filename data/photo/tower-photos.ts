import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { Photo } from "@/types/Photo";
import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";
import { db } from "@/utils/firebase-admin";
import { serializeFirestoreValue } from "@/utils/serializeFirestoreValue";

const normalizePhoto = (photoId: string, data: any): Photo =>
    ({
        ...(serializeFirestoreValue(data) as Record<string, unknown>),
        id: photoId,
    }) as Photo;

export const listTowerPhotos = cache(async (towerId: string): Promise<Photo[]> => {
    "use cache";
    cacheLife("hours");
    cacheTag(CacheTag.TowerPhotos);
    cacheTag(getCacheTagSpecific(CacheTag.TowerPhotos, towerId));

    const snap = await db
        .collection("photos")
        .where("tower_id", "==", towerId)
        .where("isPublic", "==", true)
        .get();

    return snap.docs.map((doc) => normalizePhoto(doc.id, doc.data()));
});
