"use server";

import { getChange } from "@/actions/changes/change.get";
import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";
import { db } from "@/utils/firebase";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { revalidateTag } from "next/cache";

export const changeTower = async (changeID: string) => {
    const change = await getChange(changeID);
    const towerDoc = await doc(db, "towers", change.tower_id);
    await updateDoc(towerDoc, {
        [change.field]: change.new_value,
        modified: serverTimestamp(),
    });
    revalidateTag(CacheTag.Towers);
    revalidateTag(getCacheTagSpecific(CacheTag.Tower, change.tower_id));
    revalidateTag(getCacheTagSpecific(CacheTag.Tower, change.tower_id));
};
