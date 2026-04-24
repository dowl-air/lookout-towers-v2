"use server";

import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { refresh, revalidatePath, updateTag } from "next/cache";

import { checkAuth } from "@/actions/checkAuth";
import { CacheTag, getCacheTagSpecific, getCacheTagUserSpecific } from "@/utils/cacheTags";
import { db } from "@/utils/firebase";

type MutationOptions = {
    revalidatePaths?: string[];
};

const revalidateAffectedPaths = (paths?: string[]) => {
    if (!paths?.length) {
        return;
    }

    [...new Set(paths.filter(Boolean))].forEach((path) => {
        revalidatePath(path);
    });
};

export const addToFavourites = async (towerID: string, options?: MutationOptions) => {
    const user = await checkAuth();
    if (!user) return false;
    await setDoc(doc(db, "favourites", `${user.id}_${towerID}`), {
        created: serverTimestamp(),
        user_id: user.id,
        tower_id: towerID,
    });
    updateTag(getCacheTagUserSpecific(CacheTag.TowerFavourite, user.id, towerID));
    updateTag(getCacheTagSpecific(CacheTag.UserFavourites, user.id));
    revalidateAffectedPaths(options?.revalidatePaths);
    refresh();
    return true;
};

export const removeFromFavourites = async (towerID: string, options?: MutationOptions) => {
    const user = await checkAuth();
    if (!user) return false;
    await deleteDoc(doc(db, "favourites", `${user.id}_${towerID}`));
    updateTag(getCacheTagUserSpecific(CacheTag.TowerFavourite, user.id, towerID));
    updateTag(getCacheTagSpecific(CacheTag.UserFavourites, user.id));
    revalidateAffectedPaths(options?.revalidatePaths);
    refresh();
    return false;
};
