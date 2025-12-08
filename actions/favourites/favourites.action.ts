"use server";

import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    where,
} from "firebase/firestore";
import { unstable_cache as cache, updateTag } from "next/cache";

import { checkAuth } from "@/actions/checkAuth";
import { CacheTag, getCacheTagSpecific, getCacheTagUserSpecific } from "@/utils/cacheTags";
import { db } from "@/utils/firebase";

export const checkFavourite = async (towerID: string) => {
    const user = await checkAuth();
    if (!user) return false;

    const cachedFn = cache(
        async (towerID: string, userID: string) => {
            const snap = await getDoc(doc(db, "favourites", `${userID}_${towerID}`));
            if (snap.exists()) return true;
            return false;
        },
        [CacheTag.TowerFavourite],
        {
            tags: [
                CacheTag.TowerFavourite,
                getCacheTagUserSpecific(CacheTag.TowerFavourite, user.id, towerID),
            ],
        }
    );
    return cachedFn(towerID, user.id);
};

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

export const getAllUserFavouritesIds = async () => {
    const user = await checkAuth();
    if (!user) return [];

    const cachedFn = cache(
        async (userID: string) => {
            const q = query(collection(db, "favourites"), where("user_id", "==", userID));
            const querySnapshot = await getDocs(q);
            const favourites = [];
            querySnapshot.forEach((doc) => {
                favourites.push(doc.data().tower_id);
            });
            return favourites;
        },
        [CacheTag.UserFavourites],
        {
            tags: [getCacheTagSpecific(CacheTag.UserFavourites, user.id)],
        }
    );
    return cachedFn(user.id);
};
