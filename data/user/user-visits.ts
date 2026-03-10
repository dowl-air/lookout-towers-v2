import "server-only";

import { Timestamp } from "firebase-admin/firestore";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { checkUser } from "@/data/auth";
import { getPhotos } from "@/data/photo/photo";
import { Visit } from "@/types/Visit";
import { CacheTag, getCacheTagSpecific, getCacheTagUserSpecific } from "@/utils/cacheTags";
import { db } from "@/utils/firebase-admin";

const normalizeVisit = (data: any): Visit =>
    ({
        ...data,
        date:
            data.date instanceof Timestamp
                ? data.date.toDate().toISOString()
                : new Date(data.date).toISOString(),
        created:
            data.created instanceof Timestamp
                ? data.created.toDate().toISOString()
                : new Date(data.created).toISOString(),
    }) as Visit;

const hydrateVisitPhotos = async (visits: Visit[]): Promise<Visit[]> => {
    const allPhotoIds = visits.flatMap((visit) => visit.photoIds || []);
    if (allPhotoIds.length === 0) {
        return visits.map((visit) => ({ ...visit, photos: [] }));
    }

    const photos = await getPhotos(allPhotoIds);
    const photoById = new Map(photos.map((photo) => [photo.id, photo]));

    return visits.map((visit) => ({
        ...visit,
        photos: (visit.photoIds || []).map((photoId) => photoById.get(photoId)).filter(Boolean),
    }));
};

export const getVisit = cache(async (towerID: string): Promise<Visit | null> => {
    "use cache: private";
    cacheLife("hours");

    const { userId } = await checkUser();
    if (!userId) {
        return null;
    }

    cacheTag(getCacheTagUserSpecific(CacheTag.UserTowerVisit, userId, towerID));

    const snap = await db.collection("visits").doc(`${userId}_${towerID}`).get();
    if (!snap.exists) {
        return null;
    }

    const [visit] = await hydrateVisitPhotos([normalizeVisit(snap.data())]);
    return visit;
});

export const getAllUserVisits = cache(async (): Promise<Visit[]> => {
    "use cache: private";
    cacheLife("hours");

    const { userId } = await checkUser();
    if (!userId) {
        return [];
    }

    cacheTag(CacheTag.UserVisits);
    cacheTag(getCacheTagSpecific(CacheTag.UserVisits, userId));

    const snap = await db
        .collection("visits")
        .where("user_id", "==", userId)
        .orderBy("date", "desc")
        .get();

    const visits = snap.docs.map((doc) => normalizeVisit(doc.data()));
    return hydrateVisitPhotos(visits);
});

export const getTowerVisits = cache(async (towerID: string): Promise<Visit[]> => {
    "use cache";
    cacheLife("hours");
    cacheTag(CacheTag.TowerVisits);
    cacheTag(getCacheTagSpecific(CacheTag.TowerVisits, towerID));

    const snap = await db.collection("visits").where("tower_id", "==", towerID).get();

    return snap.docs.map((doc) => normalizeVisit(doc.data()));
});

export const getMostRecentTowerVisit = cache(async (towerID: string): Promise<Visit | null> => {
    "use cache";
    cacheLife("hours");
    cacheTag(CacheTag.TowerVisits);
    cacheTag(getCacheTagSpecific(CacheTag.TowerVisits, towerID));

    const snap = await db
        .collection("visits")
        .where("tower_id", "==", towerID)
        .orderBy("date", "desc")
        .limit(1)
        .get();

    if (snap.empty) {
        return null;
    }

    return normalizeVisit(snap.docs[0].data());
});
