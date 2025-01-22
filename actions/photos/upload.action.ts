"use server";

import { checkAuth } from "@/actions/checkAuth";
import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";
import { db, storage } from "@/utils/firebase";
import { addDoc, collection, deleteDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { revalidateTag } from "next/cache";

export const uploadPhoto = async (file: File, towerId: string, isPublic: boolean): Promise<string> => {
    const user = await checkAuth();
    if (!user) throw new Error("Unauthorized.");

    // create new entry in database
    const doc = await addDoc(collection(db, "photos"), {
        created: serverTimestamp(),
        user_id: user.id,
        tower_id: towerId,
        isPublic,
    });

    try {
        const storageRef = ref(storage, `towers_users/${towerId}/${doc.id}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        //update the entry in database
        await updateDoc(doc, {
            url: downloadURL,
            id: doc.id,
        });
    } catch (error) {
        console.error("Error uploading photo: ", error);
        // delete the entry in database
        await deleteDoc(doc);
        throw new Error("Error uploading photo");
    }

    revalidateTag(getCacheTagSpecific(CacheTag.Tower, towerId));

    return doc.id;
};
