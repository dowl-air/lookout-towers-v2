"use server";

import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { updateTag } from "next/cache";

import { checkAuth } from "@/actions/checkAuth";
import { removePhoto } from "@/actions/photos/remove.action";
import { getVisit as getVisitData } from "@/data/user/user-visits";
import { Visit } from "@/types/Visit";
import { CacheTag, getCacheTagSpecific, getCacheTagUserSpecific } from "@/utils/cacheTags";
import { db } from "@/utils/firebase";

export const getVisit = async (towerID: string): Promise<Visit | null> => getVisitData(towerID);

export const setVisit = async (
    towerID: string,
    visit: Omit<Visit, "created" | "user_id" | "tower_id">
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
    return true;
};

export const removeVisit = async (towerID: string) => {
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
    return false;
};
