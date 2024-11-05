"use server";
import { Change } from "@/types/Change";
import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";
import { db } from "@/utils/firebase";
import { collection, doc, getDoc, getDocs, orderBy, query, Timestamp, where, limit as fLimit, startAfter as fStartAfter } from "firebase/firestore";
import { unstable_cache as cache } from "next/cache";

export const getChange = async (changeID: string) => {
    const cachedFn = cache(
        async (changeID: string) => {
            const snap = await getDoc(doc(db, "changes", changeID));
            if (!snap.exists()) throw new Error("Change not found.");
            let data = snap.data();
            data.id = snap.id;
            data.created = (data.created as Timestamp).toDate();
            return data as Change;
        },
        [CacheTag.Change],
        {
            tags: [getCacheTagSpecific(CacheTag.Change, changeID), CacheTag.Change],
        }
    );
    return cachedFn(changeID);
};

export const getUnresolvedChanges = async () => {
    const q = query(collection(db, "changes"), where("state", "==", "new"), orderBy("created", "desc"));
    const querySnapshot = await getDocs(q);
    const changes: Change[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id;
        data.created = (data.created as Timestamp).toDate();
        changes.push(data as Change);
    });
    return changes;
};

export const getChangesByTower = async (towerID: string, startAfter: string, limit: number) => {
    const cachedFn = cache(
        async (towerID: string, startAfter: string, limit: number) => {
            const docSnap = await getDoc(doc(db, "changes", startAfter));
            const q = query(
                collection(db, "changes"),
                where("tower_id", "==", towerID),
                orderBy("created", "desc"),
                fStartAfter(docSnap),
                fLimit(limit)
            );
            const querySnapshot = await getDocs(q);
            const changes: Change[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                data.id = doc.id;
                data.created = (data.created as Timestamp).toDate();
                changes.push(data as Change);
            });
            return changes;
        },
        [CacheTag.ChangesTower],
        {
            tags: [CacheTag.ChangesTower, getCacheTagSpecific(CacheTag.ChangesTower, towerID)],
        }
    );
    return cachedFn(towerID, startAfter, limit);
};

export const getChangesByUser = async (userID: string, startAfter: string, limit: number) => {
    const cachedFn = cache(
        async (userID: string, startAfter: string, limit: number) => {
            const docSnap = await getDoc(doc(db, "changes", startAfter));
            const q = query(
                collection(db, "changes"),
                where("user_id", "==", userID),
                orderBy("created", "desc"),
                fStartAfter(docSnap),
                fLimit(limit)
            );
            const querySnapshot = await getDocs(q);
            const changes: Change[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                data.id = doc.id;
                data.created = (data.created as Timestamp).toDate();
                changes.push(data as Change);
            });
            return changes;
        },
        [CacheTag.ChangesUser],
        {
            tags: [CacheTag.ChangesUser, getCacheTagSpecific(CacheTag.ChangesUser, userID)],
        }
    );
    return cachedFn(userID, startAfter, limit);
};
