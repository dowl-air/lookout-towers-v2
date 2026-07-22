import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { checkUser } from "@/data/auth";
import { getPhotos } from "@/data/photo/photo";
import { Rating } from "@/types/Rating";
import { Visit } from "@/types/Visit";
import { CacheTag, getCacheTagSpecific, getCacheTagUserSpecific } from "@/utils/cacheTags";
import { db } from "@/utils/firebase-admin";
import { serializeFirestoreValue } from "@/utils/serializeFirestoreValue";
import { VISITS_PER_PAGE } from "@/utils/visitPagination";
import { getVisitDateStats } from "@/utils/visitStats";

const normalizeVisit = (data: any): Visit =>
    ({
        ...(serializeFirestoreValue(data) as Record<string, unknown>),
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

const normalizeRating = (data: unknown): Rating =>
    ({
        ...(serializeFirestoreValue(data) as Record<string, unknown>),
    }) as Rating;

export type UserVisitPage = {
    visits: Visit[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextCursor?: string;
    previousCursor?: string;
};

export type UserVisitStats = {
    count: number;
    firstVisit: Visit | null;
    longestStreak: number;
    mostActiveMonth: string | null;
    mostActiveMonthCount: number;
    mostVisitsDay: string | null;
    mostVisitsDayCount: number;
    visitsThisYear: number;
};

const getUserCursorSnapshot = async (userId: string, cursor?: string) => {
    if (!cursor) {
        return null;
    }

    const snap = await db.collection("visits").doc(cursor).get();
    return snap.exists && snap.data()?.user_id === userId ? snap : null;
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

export const getUserVisitsPage = cache(
    async ({ after, before }: { after?: string; before?: string }): Promise<UserVisitPage> => {
        "use cache: private";
        cacheLife("hours");

        const { userId } = await checkUser();
        if (!userId) {
            return { visits: [], hasNextPage: false, hasPreviousPage: false };
        }

        cacheTag(CacheTag.UserVisits);
        cacheTag(getCacheTagSpecific(CacheTag.UserVisits, userId));

        if (before) {
            const cursorSnap = await getUserCursorSnapshot(userId, before);
            if (cursorSnap) {
                const snap = await db
                    .collection("visits")
                    .where("user_id", "==", userId)
                    .orderBy("date", "desc")
                    .endBefore(cursorSnap)
                    .limitToLast(VISITS_PER_PAGE + 1)
                    .get();
                const hasPreviousPage = snap.docs.length > VISITS_PER_PAGE;
                const visitDocs = snap.docs.slice(-VISITS_PER_PAGE);
                const visits = await hydrateVisitPhotos(
                    visitDocs.map((doc) => normalizeVisit(doc.data()))
                );

                return {
                    visits,
                    hasNextPage: true,
                    hasPreviousPage,
                    nextCursor: visitDocs.at(-1)?.id,
                    previousCursor: hasPreviousPage ? visitDocs[0]?.id : undefined,
                };
            }
        }

        const cursorSnap = await getUserCursorSnapshot(userId, after);
        let query = db
            .collection("visits")
            .where("user_id", "==", userId)
            .orderBy("date", "desc")
            .limit(VISITS_PER_PAGE + 1);

        if (cursorSnap) {
            query = query.startAfter(cursorSnap);
        }

        const snap = await query.get();
        const hasNextPage = snap.docs.length > VISITS_PER_PAGE;
        const visitDocs = snap.docs.slice(0, VISITS_PER_PAGE);
        const visits = await hydrateVisitPhotos(visitDocs.map((doc) => normalizeVisit(doc.data())));

        return {
            visits,
            hasNextPage,
            hasPreviousPage: Boolean(cursorSnap),
            nextCursor: hasNextPage ? visitDocs.at(-1)?.id : undefined,
            previousCursor: cursorSnap ? visitDocs[0]?.id : undefined,
        };
    }
);

export const getUserVisitStats = cache(async (): Promise<UserVisitStats> => {
    "use cache: private";
    cacheLife("hours");

    const { userId } = await checkUser();
    if (!userId) {
        return {
            count: 0,
            firstVisit: null,
            longestStreak: 0,
            mostActiveMonth: null,
            mostActiveMonthCount: 0,
            mostVisitsDay: null,
            mostVisitsDayCount: 0,
            visitsThisYear: 0,
        };
    }

    cacheTag(CacheTag.UserVisits);
    cacheTag(getCacheTagSpecific(CacheTag.UserVisits, userId));

    const visitsQuery = db.collection("visits").where("user_id", "==", userId);
    const [countSnap, firstVisitSnap, visitDatesSnap] = await Promise.all([
        visitsQuery.count().get(),
        visitsQuery.orderBy("date", "asc").limit(1).get(),
        visitsQuery.select("date").get(),
    ]);
    const visitDates = visitDatesSnap.docs
        .map((doc) => (serializeFirestoreValue(doc.data()) as Record<string, unknown>).date)
        .filter((date): date is string => typeof date === "string");
    const dateStats = getVisitDateStats(visitDates);

    return {
        count: countSnap.data().count,
        ...dateStats,
        firstVisit: firstVisitSnap.empty ? null : normalizeVisit(firstVisitSnap.docs[0].data()),
    };
});

export const getUserRatingsForTowers = cache(async (towerIds: string[]): Promise<Rating[]> => {
    "use cache: private";
    cacheLife("hours");

    const { userId } = await checkUser();
    if (!userId || towerIds.length === 0) {
        return [];
    }

    cacheTag(CacheTag.UserRatings);
    cacheTag(getCacheTagSpecific(CacheTag.UserRatings, userId));

    const uniqueTowerIds = [...new Set(towerIds)];
    const snaps = await db.getAll(
        ...uniqueTowerIds.map((towerId) => db.collection("ratings").doc(`${userId}_${towerId}`))
    );

    return snaps.filter((snap) => snap.exists).map((snap) => normalizeRating(snap.data()));
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
