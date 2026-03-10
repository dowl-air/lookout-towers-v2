import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { Photo } from "@/types/Photo";
import { CacheTag } from "@/utils/cacheTags";
import { db } from "@/utils/firebase-admin";
import { serializeFirestoreValue } from "@/utils/serializeFirestoreValue";

const normalizePhoto = (photoId: string, data: any): Photo =>
    ({
        ...(serializeFirestoreValue(data) as Record<string, unknown>),
        id: photoId,
    }) as Photo;

export const getPhoto = cache(async (photoId: string): Promise<Photo | null> => {
    "use cache";
    cacheLife("hours");
    cacheTag(CacheTag.Photo);

    const snap = await db.collection("photos").doc(photoId).get();
    if (!snap.exists) {
        return null;
    }

    return normalizePhoto(snap.id, snap.data());
});

export const getPhotos = cache(async (photoIds: string[]): Promise<Photo[]> => {
    if (photoIds.length === 0) {
        return [];
    }

    const uniquePhotoIds = Array.from(new Set(photoIds));
    const refs = uniquePhotoIds.map((photoId) => db.collection("photos").doc(photoId));
    const docs = await db.getAll(...refs);

    const photoById = new Map<string, Photo>();
    docs.forEach((snap) => {
        if (snap.exists) {
            photoById.set(snap.id, normalizePhoto(snap.id, snap.data()));
        }
    });

    return photoIds
        .map((photoId) => photoById.get(photoId))
        .filter((photo): photo is Photo => Boolean(photo));
});
