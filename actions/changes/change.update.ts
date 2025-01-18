"use server";

import { checkAuth } from "@/actions/checkAuth";
import { changeTower } from "@/actions/towers/tower.change";
import { ChangeState } from "@/types/Change";
import { Tower } from "@/types/Tower";
import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";
import { db } from "@/utils/firebase";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { revalidateTag } from "next/cache";

export const updateChange = async (changeID: string, state: ChangeState, tower: Tower) => {
    const user = await checkAuth();
    if (!user) throw new Error("Unauthorized");
    await updateDoc(doc(db, "changes", changeID), {
        state,
        modified: serverTimestamp(),
    });
    await changeTower(changeID, tower);
    revalidateTag(getCacheTagSpecific(CacheTag.Change, changeID));
    revalidateTag(getCacheTagSpecific(CacheTag.ChangesTower, tower.id));
    revalidateTag(getCacheTagSpecific(CacheTag.ChangesUser, user.id));
    revalidateTag(CacheTag.ChangesTower);
    revalidateTag(CacheTag.UnresolvedChanges);
};
