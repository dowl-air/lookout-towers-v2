"use server";

import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { refresh, revalidatePath, updateTag } from "next/cache";

import { checkAuth } from "@/actions/checkAuth";
import { removePhoto } from "@/actions/photos/remove.action";
import { getVisit as getVisitData } from "@/data/user/user-visits";
import { Visit } from "@/types/Visit";
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

export const getVisit = async (towerID: string): Promise<Visit | null> => getVisitData(towerID);

export const setVisit = async (
    towerID: string,
    visit: Omit<Visit, "created" | "user_id" | "tower_id">,
    options?: MutationOptions
) => {
    const user = await checkAuth();
    await setDoc(doc(db, "visits", `${user.id}_${towerID}`), {
        ...visit,
        created: serverTimestamp(),
        user_id: user.id,
        tower_id: towerID,
    });
    updateTag(getCacheTagSpecific(CacheTag.TowerVisitsCount, towerID));
    updateTag(CacheTag.VisitsCount);
    updateTag(getCacheTagSpecific(CacheTag.TowerVisits, towerID));
    updateTag(getCacheTagSpecific(CacheTag.UserVisits, user.id));
    updateTag(getCacheTagUserSpecific(CacheTag.UserTowerVisit, user.id, towerID));
    revalidateAffectedPaths(options?.revalidatePaths);
    refresh();
    return true;
};

export const removeVisit = async (towerID: string, options?: MutationOptions) => {
    const user = await checkAuth();
    const snap = await getDoc(doc(db, "visits", `${user.id}_${towerID}`));
    const data = snap.data();
    if (data?.photoIds?.length > 0) {
        const promises = data.photoIds.map((id: string) => removePhoto(id));
        await Promise.all(promises);
    }
    await deleteDoc(doc(db, "visits", `${user.id}_${towerID}`));
    updateTag(getCacheTagSpecific(CacheTag.TowerVisitsCount, towerID));
    updateTag(CacheTag.VisitsCount);
    updateTag(getCacheTagSpecific(CacheTag.TowerVisits, towerID));
    updateTag(getCacheTagSpecific(CacheTag.UserVisits, user.id));
    updateTag(getCacheTagUserSpecific(CacheTag.UserTowerVisit, user.id, towerID));
    revalidateAffectedPaths(options?.revalidatePaths);
    refresh();
    return false;
};
