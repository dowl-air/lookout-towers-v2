"use server";

import { checkAuth } from "@/actions/checkAuth";
import { PhotoNote } from "@/types/Photo";
import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";
import { db, storage } from "@/utils/firebase";
import { addDoc, collection, deleteDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { revalidateTag } from "next/cache";

export const uploadPhoto = async (
    file: File | string,
    towerId: string,
    isPublic: boolean,
    isMain?: boolean,
    note?: PhotoNote,
    returnUrl: boolean = true
): Promise<string> => {
    const user = await checkAuth();
    if (!user) throw new Error("Unauthorized.");

    // create new entry in database
    const doc = await addDoc(collection(db, "photos"), {
        created: serverTimestamp(),
        user_id: user.id,
        tower_id: towerId,
        isPublic,
        isMain: isMain || false,
        note: note || null,
    });

    try {
        const storageRef = ref(storage, `towers_users/${towerId}/${doc.id}`);

        let snapshot;
        if (file instanceof File) {
            // Handle File upload
            snapshot = await uploadBytes(storageRef, file);
        } else {
            // Handle URL upload
            const response = await fetch(file.toString());
            if (!response.ok) {
                throw new Error(`Failed to fetch image from URL: ${response.statusText}`);
            }
            const blob = await response.blob();
            snapshot = await uploadBytes(storageRef, blob);
        }

        const downloadURL = await getDownloadURL(snapshot.ref);

        //update the entry in database
        await updateDoc(doc, {
            url: downloadURL,
            id: doc.id,
        });

        revalidateTag(getCacheTagSpecific(CacheTag.Tower, towerId));

        return returnUrl ? downloadURL : doc.id;
    } catch (error) {
        console.error("Error uploading photo: ", error);
        // delete the entry in database
        await deleteDoc(doc);
        throw new Error("Error uploading photo");
    }
};
