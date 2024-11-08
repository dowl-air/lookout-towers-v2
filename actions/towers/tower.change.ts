"use server";

import { getChange } from "@/actions/changes/change.get";
import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";
import { db } from "@/utils/firebase";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { revalidateTag } from "next/cache";

export const changeTower = async (changeID: string) => {
    const change = await getChange(changeID);
    const towerDoc = await doc(db, "towers", change.tower_id);
    let newValue = change.new_value;
    if (change.type === "date") {
        newValue = new Date(newValue);
    }
    await updateDoc(towerDoc, {
        [change.field]: newValue,
        modified: serverTimestamp(),
    });
    revalidateTag(CacheTag.Towers);
    revalidateTag(CacheTag.LastChangeDate);
    revalidateTag(getCacheTagSpecific(CacheTag.Tower, change.tower_id));
    revalidateTag(getCacheTagSpecific(CacheTag.Tower, change.tower_id));
};
