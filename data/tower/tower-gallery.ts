import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";
import { storageBucket } from "@/utils/firebase-admin";

export type TowerGalleryPhoto = {
    storagePath: string;
    url: string;
};

export const listTowerGalleryPhotos = cache(async (id: string): Promise<TowerGalleryPhoto[]> => {
    "use cache";
    cacheLife("days");
    cacheTag(CacheTag.TowerGallery);
    cacheTag(getCacheTagSpecific(CacheTag.TowerGallery, id));

    const prefix = `towers/${id}/`;
    const [files] = await storageBucket.getFiles({ prefix });

    return files
        .filter((file) => file.name !== prefix)
        .sort((left, right) => left.name.localeCompare(right.name))
        .map((file) => ({
            storagePath: file.name,
            url: `https://firebasestorage.googleapis.com/v0/b/${storageBucket.name}/o/${encodeURIComponent(file.name)}?alt=media`,
        }));
});

export const getUrlsTowerGallery = async (id: string): Promise<string[]> =>
    (await listTowerGalleryPhotos(id)).map((photo) => photo.url);
