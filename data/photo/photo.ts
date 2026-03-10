import "server-only";

import { Timestamp } from "firebase-admin/firestore";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { Photo } from "@/types/Photo";
import { CacheTag } from "@/utils/cacheTags";
import { db } from "@/utils/firebase-admin";

const normalizePhoto = (photoId: string, data: any): Photo =>
    ({
        ...data,
        id: photoId,
        created:
            data.created instanceof Timestamp
                ? data.created.toDate().toISOString()
                : new Date(data.created).toISOString(),
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
