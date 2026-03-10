import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";
import { storageBucket } from "@/utils/firebase-admin";

export const getUrlsTowerGallery = cache(async (id: string): Promise<string[]> => {
    "use cache";
    cacheLife("days");
    cacheTag(CacheTag.TowerGallery);
    cacheTag(getCacheTagSpecific(CacheTag.TowerGallery, id));

    const prefix = `towers/${id}/`;
    const [files] = await storageBucket.getFiles({ prefix });

    return files
        .filter((file) => file.name !== prefix)
        .sort((left, right) => left.name.localeCompare(right.name))
        .map(
            (file) =>
                `https://firebasestorage.googleapis.com/v0/b/${storageBucket.name}/o/${encodeURIComponent(file.name)}?alt=media`
        );
});
