import { Photo } from "@/types/Photo";
import { CacheTag } from "@/utils/cacheTags";
import { db } from "@/utils/firebase";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { unstable_cache as cache } from "next/cache";

export const getPhoto = async (photoId: string) => {
    const cachedFn = cache(
        async (photoId: string) => {
            const photo = await getDoc(doc(db, "photos", photoId));
            const data = photo.data();
            data.created = (data.created as Timestamp).toDate().toISOString();
            return data as Photo;
        },
        [CacheTag.Photo],
        { revalidate: 60 * 60 * 2 }
    );
    return cachedFn(photoId);
};
