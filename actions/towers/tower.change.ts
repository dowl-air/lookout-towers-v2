"use server";

import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { updateTag } from "next/cache";

import { checkAdmin } from "@/actions/checkAdmin";
import { getChange } from "@/data/change/changes";
import { Tower } from "@/types/Tower";
import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";
import { db } from "@/utils/firebase";
import { getOpeningHoursValidationError, normalizeOpeningHours } from "@/utils/openingHours";

export const changeTower = async (changeID: string, tower: Tower) => {
    const change = await getChange(changeID);
    const towerDoc = await doc(db, "towers", change.tower_id);
    let newValue = change.new_value;
    if (change.type === "date") {
        newValue = new Date(newValue);
    }
    if (change.type === "number") {
        newValue = Number(newValue);
    }
    if (change.field === "urls") {
        // only add one new value to the end of the array
        newValue = [...(tower.urls || []), change.new_value[change.new_value.length - 1]];
    }
    if (change.field === "openingHours") {
        newValue = normalizeOpeningHours(newValue);
        const validationError = getOpeningHoursValidationError(newValue);
        if (validationError) throw new Error(validationError);
    }
    await updateDoc(towerDoc, {
        [change.field]: newValue,
        modified: serverTimestamp(),
    });
    updateTag(CacheTag.Towers);
    updateTag(CacheTag.LastChangeDate);
    updateTag(getCacheTagSpecific(CacheTag.Tower, change.tower_id));
    updateTag(getCacheTagSpecific(CacheTag.Tower, tower.nameID));
};

export const changeTowerMainPhoto = async (towerID: string, mainPhotoUrl: string) => {
    if (!(await checkAdmin())) throw new Error("Unauthorized");

    const towerDoc = await doc(db, "towers", towerID);
    await updateDoc(towerDoc, {
        mainPhotoUrl,
        modified: serverTimestamp(),
    });
    updateTag(CacheTag.Towers);
    updateTag(CacheTag.LastChangeDate);
    updateTag(getCacheTagSpecific(CacheTag.Tower, towerID));
};
