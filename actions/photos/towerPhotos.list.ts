import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";
import { db } from "@/utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { unstable_cache as cache } from "next/cache";

export const listTowerPhotos = async (towerId: string) => {
    const cachedFn = cache(
        async (towerId: string) => {
            const photosRef = collection(db, "photos");
            const q = query(photosRef, where("tower_id", "==", towerId), where("isPublic", "==", true));
            const querySnapshot = await getDocs(q);
            const photos = [];
            querySnapshot.forEach((doc) => {
                photos.push(doc.data());
            });
            return photos;
        },
        [CacheTag.TowerPhotos],
        {
            tags: [CacheTag.TowerPhotos, getCacheTagSpecific(CacheTag.TowerPhotos, towerId)],
        }
    );
    return cachedFn(towerId);
};
