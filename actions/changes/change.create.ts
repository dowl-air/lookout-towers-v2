"use server";

import { checkAuth } from "@/actions/checkAuth";
import { Change, ChangeState } from "@/types/Change";
import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";
import { db } from "@/utils/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { revalidateTag } from "next/cache";

export const createChange = async (change: Omit<Change, "user_id" | "id" | "created" | "state">) => {
    const user = await checkAuth();
    if (!user) throw new Error("Unauthorized.");
    // todo check if there is already a change for this field and from which user
    const doc = await addDoc(collection(db, "changes"), {
        ...change,
        created: serverTimestamp(),
        user_id: user.id,
        state: ChangeState.New,
    });
    revalidateTag(CacheTag.ChangesCount);
    revalidateTag(CacheTag.UnresolvedChanges);
    revalidateTag(getCacheTagSpecific(CacheTag.ChangesTower, change.tower_id));
    revalidateTag(getCacheTagSpecific(CacheTag.ChangesUser, user.id));
    return doc.id;
};
