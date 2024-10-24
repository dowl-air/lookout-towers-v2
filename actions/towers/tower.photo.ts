"use server";

import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";
import { storage } from "@/utils/firebase";
import { listAll, ref } from "firebase/storage";
import { unstable_cache as cache } from "next/cache";

const URL = "https://firebasestorage.googleapis.com/v0/b/";
const BUCKET = "lookout-towers.appspot.com/";
const PATH = "o/towers";

export const getUrlsTowerGallery = async (id: string): Promise<string[]> => {
    const cachedFn = cache(
        async (id: string) => {
            const list = await listAll(ref(storage, "towers/" + id));
            return list.items.map((item) => `${URL}${BUCKET}${PATH}%2F${id}%2F${item.name}?alt=media`);
        },
        [CacheTag.TowerGallery],
        {
            tags: [CacheTag.TowerGallery, getCacheTagSpecific(CacheTag.TowerGallery, id)],
            revalidate: 60 * 60 * 24 * 7, // 1 week backup revalidation
        }
    );
    return cachedFn(id);
};
