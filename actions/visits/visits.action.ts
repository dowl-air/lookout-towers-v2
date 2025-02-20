"use server";

import { checkAuth } from "../checkAuth";
import { Timestamp, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { revalidateTag, unstable_cache as cache } from "next/cache";
import { CacheTag, getCacheTagSpecific, getCacheTagUserSpecific } from "@/utils/cacheTags";
import { Visit } from "@/types/Visit";
import { getPhotos } from "@/actions/photos/towerPhotos.get";
import { removePhoto } from "@/actions/photos/remove.action";

export const getVisit = async (towerID: string): Promise<Visit | null> => {
    const user = await checkAuth();
    if (!user) return null;

    const cacheFn = cache(
        async (towerID: string, userID: string) => {
            const snap = await getDoc(doc(db, "visits", `${userID}_${towerID}`));
            if (!snap.exists()) return null;
            const data = snap.data();
            const visit = { ...data, date: new Date(data.date).toISOString(), created: (data.created as Timestamp).toDate().toISOString() } as Visit;
            if (visit.photoIds) {
                const photos = await getPhotos(visit.photoIds);
                visit.photos = photos;
            }
            return visit;
        },
        [CacheTag.UserTowerVisit],
        {
            tags: [getCacheTagUserSpecific(CacheTag.UserTowerVisit, user.id, towerID)],
        }
    );
    return cacheFn(towerID, user.id);
};

export const setVisit = async (towerID: string, visit: Omit<Visit, "created" | "user_id" | "tower_id">) => {
    const user = await checkAuth();
    await setDoc(doc(db, "visits", `${user.id}_${towerID}`), {
        ...visit,
        created: serverTimestamp(),
        user_id: user.id,
        tower_id: towerID,
    });
    revalidateTag(getCacheTagSpecific(CacheTag.TowerVisitsCount, towerID));
    revalidateTag(CacheTag.VisitsCount);
    revalidateTag(getCacheTagSpecific(CacheTag.TowerVisits, towerID));
    revalidateTag(getCacheTagSpecific(CacheTag.UserVisits, user.id));
    revalidateTag(getCacheTagUserSpecific(CacheTag.UserTowerVisit, user.id, towerID));
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
    revalidateTag(getCacheTagSpecific(CacheTag.TowerVisitsCount, towerID));
    revalidateTag(CacheTag.VisitsCount);
    revalidateTag(getCacheTagSpecific(CacheTag.TowerVisits, towerID));
    revalidateTag(getCacheTagSpecific(CacheTag.UserVisits, user.id));
    revalidateTag(getCacheTagUserSpecific(CacheTag.UserTowerVisit, user.id, towerID));
    return false;
};

export const getAllUserVisits = async (): Promise<Visit[]> => {
    const user = await checkAuth();
    if (!user) return [];

    const cacheFn = cache(
        async (userID: string) => {
            const visits: Visit[] = [];
            const q = await query(collection(db, "visits"), where("user_id", "==", userID), orderBy("date", "desc"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                visits.push({
                    ...data,
                    date: new Date(data.date).toISOString(),
                    created: (data.created as Timestamp).toDate().toISOString(),
                } as Visit);
            });
            // get photos for each visit
            const allPhotoIds = visits.reduce((acc: string[], visit) => {
                if (visit.photoIds) {
                    acc.push(...visit.photoIds);
                }
                return acc;
            }, []);
            const photos = await getPhotos(allPhotoIds);
            visits.forEach((visit) => {
                visit.photos = visit.photoIds ? visit.photoIds.map((id) => photos.find((p) => p.id === id)) : [];
            });
            return visits;
        },
        [CacheTag.UserVisits],
        {
            tags: [getCacheTagSpecific(CacheTag.UserVisits, user.id)],
        }
    );
    return cacheFn(user.id);
};

export const getTowerVisits = async (towerID: string): Promise<Visit[]> => {
    const cacheFn = cache(
        async (towerID: string) => {
            const q = query(collection(db, "visits"), where("tower_id", "==", towerID));
            const querySnapshot = await getDocs(q);
            const visits: Visit[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                visits.push({
                    ...data,
                    date: new Date(data.date).toISOString(),
                    created: (data.created as Timestamp).toDate().toISOString(),
                } as Visit);
            });
            return visits;
        },
        [CacheTag.TowerVisits],
        {
            tags: [CacheTag.TowerVisits, getCacheTagSpecific(CacheTag.TowerVisits, towerID)],
        }
    );
    return cacheFn(towerID);
};

export const getMostRecentTowerVisit = async (towerID: string): Promise<Visit | null> => {
    const cacheFn = cache(
        async (towerID: string) => {
            const q = query(collection(db, "visits"), where("tower_id", "==", towerID), orderBy("date", "desc"), limit(1));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) return null;
            const doc = querySnapshot.docs[0];
            const data = doc.data();
            return { ...data, date: new Date(data.date).toISOString(), created: (data.created as Timestamp).toDate().toISOString() } as Visit;
        },
        [CacheTag.TowerVisits, "mostRecentVisit"],
        {
            tags: [CacheTag.TowerVisits, getCacheTagSpecific(CacheTag.TowerVisits, towerID)],
        }
    );
    return cacheFn(towerID);
};
