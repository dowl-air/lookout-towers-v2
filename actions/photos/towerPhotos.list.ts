import { Photo } from "@/types/Photo";
import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";
import { db } from "@/utils/firebase";
import { Timestamp } from "firebase-admin/firestore";
import { collection, getDocs, query, where } from "firebase/firestore";
import { unstable_cache as cache } from "next/cache";

export const listTowerPhotos = async (towerId: string): Promise<Photo[]> => {
    const cachedFn = cache(
        async (towerId: string) => {
            const photosRef = collection(db, "photos");
            const q = query(photosRef, where("tower_id", "==", towerId), where("isPublic", "==", true));
            const querySnapshot = await getDocs(q);
            const photos: Photo[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                data.created = (data.created as Timestamp).toDate().toISOString();
                photos.push(data as Photo);
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
