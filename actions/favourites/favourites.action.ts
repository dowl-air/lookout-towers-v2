"use server";

import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { updateTag } from "next/cache";

import { checkAuth } from "@/actions/checkAuth";
import { CacheTag, getCacheTagSpecific, getCacheTagUserSpecific } from "@/utils/cacheTags";
import { db } from "@/utils/firebase";

export const addToFavourites = async (towerID: string) => {
    const user = await checkAuth();
    if (!user) return false;
    await setDoc(doc(db, "favourites", `${user.id}_${towerID}`), {
        created: serverTimestamp(),
        user_id: user.id,
        tower_id: towerID,
    });
    updateTag(getCacheTagUserSpecific(CacheTag.TowerFavourite, user.id, towerID));
    updateTag(getCacheTagSpecific(CacheTag.UserFavourites, user.id));
    return true;
};

export const removeFromFavourites = async (towerID: string) => {
    const user = await checkAuth();
    if (!user) return false;
    await deleteDoc(doc(db, "favourites", `${user.id}_${towerID}`));
    updateTag(getCacheTagUserSpecific(CacheTag.TowerFavourite, user.id, towerID));
    updateTag(getCacheTagSpecific(CacheTag.UserFavourites, user.id));
    return false;
};
