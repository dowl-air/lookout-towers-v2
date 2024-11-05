"use server";
import { checkAuth } from "@/actions/checkAuth";
import { changeTower } from "@/actions/towers/tower.change";
import { ChangeState } from "@/types/Change";
import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";
import { db } from "@/utils/firebase";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { revalidateTag } from "next/cache";

export const updateChange = async (changeID: string, state: ChangeState, towerID: string) => {
    const user = await checkAuth();
    if (!user) throw new Error("Unauthorized");
    await updateDoc(doc(db, "changes", changeID), {
        state,
        modified: serverTimestamp(),
    });
    await changeTower(changeID);
    revalidateTag(getCacheTagSpecific(CacheTag.Change, changeID));
    revalidateTag(getCacheTagSpecific(CacheTag.ChangesTower, towerID));
    revalidateTag(getCacheTagSpecific(CacheTag.ChangesUser, user.id));
    revalidateTag(CacheTag.ChangesTower);
    revalidateTag(CacheTag.UnresolvedChanges);
};
