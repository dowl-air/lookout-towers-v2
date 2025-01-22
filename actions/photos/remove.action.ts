"use server";

import { checkAdmin } from "@/actions/checkAdmin";
import { checkAuth } from "@/actions/checkAuth";
import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";
import { db, storage } from "@/utils/firebase";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { revalidateTag } from "next/cache";

export const removePhoto = async (photoId: string) => {
    const user = await checkAuth();
    if (!user) throw new Error("Unauthorized.");
    const isAdmin = await checkAdmin();

    const docRef = doc(db, "photos", photoId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) throw new Error("Photo not found.");
    const photo = snap.data();
    if (photo.user_id !== user.id && !isAdmin) throw new Error("Unauthorized.");

    const storageRef = ref(storage, `towers_users/${photo.tower_id}/${photoId}`);

    await deleteObject(storageRef);
    await deleteDoc(docRef);

    revalidateTag(getCacheTagSpecific(CacheTag.Tower, photo.tower_id));
};
