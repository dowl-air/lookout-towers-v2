"use server";

import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { updateTag } from "next/cache";

import { checkAuth } from "@/actions/checkAuth";
import { changeTower } from "@/actions/towers/tower.change";
import { ChangeState } from "@/types/Change";
import { Tower } from "@/types/Tower";
import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";
import { db } from "@/utils/firebase";

export const updateChange = async (changeID: string, state: ChangeState, tower: Tower) => {
    const user = await checkAuth();
    if (!user) throw new Error("Unauthorized");
    await updateDoc(doc(db, "changes", changeID), {
        state,
        modified: serverTimestamp(),
    });
    if (state === ChangeState.Approved) {
        await changeTower(changeID, tower);
    }
    updateTag(getCacheTagSpecific(CacheTag.Change, changeID));
    updateTag(getCacheTagSpecific(CacheTag.ChangesTower, tower.id));
    updateTag(getCacheTagSpecific(CacheTag.ChangesUser, user.id));
    updateTag(CacheTag.ChangesTower);
    updateTag(CacheTag.UnresolvedChanges);
};
