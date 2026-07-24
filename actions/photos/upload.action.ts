"use server";

import { addDoc, collection, deleteDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateTag } from "next/cache";

import { checkAdmin } from "@/actions/checkAdmin";
import { checkAuth } from "@/actions/checkAuth";
import { PhotoNote } from "@/types/Photo";
import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";
import { db, storage } from "@/utils/firebase";

const uploadPhotoContent = async (
    file: Blob,
    towerId: string,
    isPublic: boolean,
    userId: string,
    isMain?: boolean,
    note?: PhotoNote,
    returnUrl: boolean = true
): Promise<string> => {
    // create new entry in database
    const doc = await addDoc(collection(db, "photos"), {
        created: serverTimestamp(),
        user_id: userId,
        tower_id: towerId,
        isPublic,
        isMain: isMain || false,
        note: note || null,
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

        updateTag(getCacheTagSpecific(CacheTag.Tower, towerId));

        return returnUrl ? downloadURL : doc.id;
    } catch (error) {
        console.error("Error uploading photo: ", error);
        // delete the entry in database
        await deleteDoc(doc);
        throw new Error("Error uploading photo");
    }
};

export const uploadPhoto = async (
    file: File,
    towerId: string,
    isPublic: boolean,
    isMain?: boolean,
    note?: PhotoNote,
    returnUrl: boolean = true
): Promise<string> => {
    const user = await checkAuth();
    if (!user) throw new Error("Unauthorized.");

    return uploadPhotoContent(file, towerId, isPublic, user.id, isMain, note, returnUrl);
};

export const uploadPhotoFromUrl = async (
    url: string,
    towerId: string,
    isPublic: boolean,
    isMain?: boolean,
    note?: PhotoNote,
    returnUrl: boolean = true
): Promise<string> => {
    const user = await checkAuth();
    if (!user || !(await checkAdmin())) throw new Error("Unauthorized.");

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch image from URL: ${response.statusText}`);
    }

    return uploadPhotoContent(
        await response.blob(),
        towerId,
        isPublic,
        user.id,
        isMain,
        note,
        returnUrl
    );
};
