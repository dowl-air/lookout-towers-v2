import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { checkUser } from "@/data/auth";
import { getPhoto } from "@/data/photo/photo";
import { getRandomTowers, getTowerByID } from "@/data/tower/towers";
import { getCzechTowersForProgress } from "@/data/tower/towers-collection";
import { getUserById } from "@/data/user/user";
import { Tower } from "@/types/Tower";
import { User } from "@/types/User";
import { Visit } from "@/types/Visit";
import { CacheTag, getCacheTagSpecific, getCacheTagUserSpecific } from "@/utils/cacheTags";
import { db } from "@/utils/firebase-admin";
import { serializeFirestoreValue } from "@/utils/serializeFirestoreValue";
import { getAccessibleTowerProgress } from "@/utils/towerProgress";

export type HomeDashboardRecommendation = {
    description: string;
    href: string;
    id: string;
    label: string;
    photoUrl: string | null;
    title: string;
};

export type HomeDashboardData =
    | {
          isAuthenticated: false;
      }
    | {
          isAuthenticated: true;
          lastVisit: {
              date: string;
              hasRating: boolean;
              photoUrl: string | null;
              tower: Tower | null;
          } | null;
          progress: {
              progressPercent: number;
              favouritesCount: number;
              ratingsCount: number;
              totalAccessibleTowersCount: number;
              visitsCount: number;
          };
          recommendations: HomeDashboardRecommendation[];
          user: User | null;
      };

const normalizeVisit = (data: FirebaseFirestore.DocumentData | undefined): Visit | null => {
    if (!data) {
        return null;
    }

    return {
        ...(serializeFirestoreValue(data) as Record<string, unknown>),
    } as Visit;
};

const getCollectionCount = async (collectionName: string, userId: string): Promise<number> => {
    const snap = await db.collection(collectionName).where("user_id", "==", userId).count().get();
    return snap.data().count || 0;
};

const getLastUserVisit = async (userId: string): Promise<Visit | null> => {
    const snap = await db
        .collection("visits")
        .where("user_id", "==", userId)
        .orderBy("date", "desc")
        .limit(1)
        .get();

    if (snap.empty) {
        return null;
    }

    return normalizeVisit(snap.docs[0].data());
};

const getUserVisitedTowerIds = async (userId: string): Promise<string[]> => {
    const snap = await db
        .collection("visits")
        .where("user_id", "==", userId)
        .select("tower_id")
        .get();

    return snap.docs.map((doc) => doc.data().tower_id).filter(Boolean);
};

const getLastVisitPhotoUrl = async (visit: Visit): Promise<string | null> => {
    const [photoId] = visit.photoIds || [];
    if (!photoId) {
        return null;
    }

    const photo = await getPhoto(photoId);
    return photo?.url || null;
};

const hasUserRatingForTower = async (userId: string, towerId: string): Promise<boolean> => {
    const snap = await db.collection("ratings").doc(`${userId}_${towerId}`).get();
    return snap.exists;
};

const toRecommendation = (tower: Tower): HomeDashboardRecommendation => ({
    description: tower.locationText || "Tip z katalogu pro další výlet.",
    href: `/${tower.type || "rozhledna"}/${tower.nameID}`,
    id: tower.id,
    label: "Tip na další výpravu",
    photoUrl: tower.mainPhotoUrl || null,
    title: tower.name,
});

const getRecommendations = async (
    visitedTowerIds: string[]
): Promise<HomeDashboardRecommendation[]> => {
    const visitedIds = new Set(visitedTowerIds);
    const randomTowers = await getRandomTowers(8);

    return randomTowers
        .filter((tower) => !visitedIds.has(tower.id))
        .slice(0, 3)
        .map((tower) => toRecommendation(tower));
};

export const getHomeDashboardData = cache(async (): Promise<HomeDashboardData> => {
    "use cache: private";
    cacheLife("hours");

    const { userId } = await checkUser();
    if (!userId) {
        return { isAuthenticated: false };
    }

    cacheTag(CacheTag.User);
    cacheTag(getCacheTagSpecific(CacheTag.User, userId));
    cacheTag(CacheTag.UserVisits);
    cacheTag(getCacheTagSpecific(CacheTag.UserVisits, userId));
    cacheTag(CacheTag.UserRatings);
    cacheTag(getCacheTagSpecific(CacheTag.UserRatings, userId));
    cacheTag(CacheTag.UserFavourites);
    cacheTag(getCacheTagSpecific(CacheTag.UserFavourites, userId));
    cacheTag(CacheTag.Towers);

    const [user, visitedTowerIds, ratingsCount, favouritesCount, progressTowers, lastVisit] =
        await Promise.all([
            getUserById(userId),
            getUserVisitedTowerIds(userId),
            getCollectionCount("ratings", userId),
            getCollectionCount("favourites", userId),
            getCzechTowersForProgress(),
            getLastUserVisit(userId),
        ]);
    const progress = getAccessibleTowerProgress(progressTowers, new Set(visitedTowerIds));

    if (!lastVisit) {
        return {
            isAuthenticated: true,
            lastVisit: null,
            progress: {
                favouritesCount,
                progressPercent: progress.progressPercent,
                ratingsCount,
                totalAccessibleTowersCount: progress.totalAccessibleCount,
                visitsCount: progress.visitedAccessibleCount,
            },
            recommendations: [],
            user,
        };
    }

    cacheTag(getCacheTagUserSpecific(CacheTag.UserTowerVisit, userId, lastVisit.tower_id));
    cacheTag(getCacheTagUserSpecific(CacheTag.UserTowerRating, userId, lastVisit.tower_id));

    const [tower, hasRating, photoUrl, recommendations] = await Promise.all([
        getTowerByID(lastVisit.tower_id),
        hasUserRatingForTower(userId, lastVisit.tower_id),
        getLastVisitPhotoUrl(lastVisit),
        getRecommendations(visitedTowerIds),
    ]);

    return {
        isAuthenticated: true,
        lastVisit: {
            date: lastVisit.date,
            hasRating,
            photoUrl,
            tower,
        },
        progress: {
            favouritesCount,
            progressPercent: progress.progressPercent,
            ratingsCount,
            totalAccessibleTowersCount: progress.totalAccessibleCount,
            visitsCount: progress.visitedAccessibleCount,
        },
        recommendations,
        user,
    };
});
