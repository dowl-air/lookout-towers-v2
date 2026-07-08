import "server-only";

import { getDistance } from "geolib";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { checkUser } from "@/data/auth";
import { getPhoto } from "@/data/photo/photo";
import { getNearestTowers } from "@/data/tower/nearest-towers";
import { getRandomTowers, getTowerByID } from "@/data/tower/towers";
import { getCzechTowersForProgress } from "@/data/tower/towers-collection";
import { getUserById } from "@/data/user/user";
import { Tower } from "@/types/Tower";
import { TowerTag } from "@/types/TowerTags";
import { User } from "@/types/User";
import { Visit } from "@/types/Visit";
import { CacheTag, getCacheTagSpecific, getCacheTagUserSpecific } from "@/utils/cacheTags";
import { db } from "@/utils/firebase-admin";
import { formatDistance } from "@/utils/geo";
import { serializeFirestoreValue } from "@/utils/serializeFirestoreValue";
import { getAccessibleTowerProgress } from "@/utils/towerProgress";
import { getUserLevel } from "@/utils/userLevels";

export type HomeDashboardRecommendationReason =
    | "cycling-friendly"
    | "favourite-match"
    | "last-visit-nearby"
    | "near-user"
    | "newly-opened"
    | "random";

export type HomeDashboardRecommendation = {
    description: string;
    href: string;
    id: string;
    label: string;
    photoUrl: string | null;
    reason: HomeDashboardRecommendationReason;
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
              hasPhoto: boolean;
              hasRating: boolean;
              photoUrl: string | null;
              tower: Tower | null;
          } | null;
          progress: {
              currentLevelColor: string;
              currentLevelName: string;
              currentLevelTextColor: string;
              levelProgressPercent: number;
              nextLevelName: string | null;
              nextLevelVisits: number;
              progressPercent: number;
              favouritesCount: number;
              ratingsCount: number;
              remainingVisitsToNextLevel: number;
              totalAccessibleTowersCount: number;
              visitsCount: number;
          };
          recommendations: HomeDashboardRecommendation[];
          user: User | null;
          visitedTowerIds: string[];
      };

const RECOMMENDATIONS_PER_TYPE_LIMIT = 4;

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

const getUserFavouriteTowerIds = async (userId: string): Promise<string[]> => {
    const snap = await db
        .collection("favourites")
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

const getOpenedTimestamp = (tower: Tower): number => {
    if (!tower.opened) {
        return 0;
    }

    const timestamp = new Date(tower.opened).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
};

const getRecentlyOpenedTowers = async (): Promise<Tower[]> => {
    const snap = await db.collection("towers").orderBy("opened", "desc").limit(12).get();
    return snap.docs.map((doc) => serializeFirestoreValue(doc.data()) as Tower);
};

const getCyclingFriendlyTowers = async (): Promise<Tower[]> => {
    const snap = await db
        .collection("towers")
        .where("tags", "array-contains", TowerTag.SuitableForCyclists)
        .limit(12)
        .get();

    return snap.docs.map((doc) => serializeFirestoreValue(doc.data()) as Tower);
};

const isAlreadyOpened = (tower: Tower): boolean => {
    const openedTimestamp = getOpenedTimestamp(tower);
    return openedTimestamp > 0 && openedTimestamp <= Date.now();
};

const getTowerDistanceLabel = (fromTower: Tower, toTower: Tower): string | null => {
    if (!fromTower.gps || !toTower.gps) {
        return null;
    }

    const distance = getDistance(fromTower.gps, toTower.gps);
    return `${formatDistance(distance)} od poslední navštívené`;
};

const toRecommendation = ({
    description,
    label,
    reason,
    tower,
}: {
    description?: string;
    label: string;
    reason: HomeDashboardRecommendationReason;
    tower: Tower;
}): HomeDashboardRecommendation => ({
    description: description || tower.locationText || "Tip z katalogu pro další výlet.",
    href: `/${tower.type || "rozhledna"}/${tower.nameID}`,
    id: tower.id,
    label,
    photoUrl: tower.mainPhotoUrl || null,
    reason,
    title: tower.name,
});

const getRecommendations = async (
    favouriteTowerIds: string[],
    lastVisitTower: Tower | null,
    visitedTowerIds: string[]
): Promise<HomeDashboardRecommendation[]> => {
    const visitedIds = new Set(visitedTowerIds);
    const usedIds = new Set<string>();
    const recommendationCandidates: HomeDashboardRecommendation[] = [];

    const addRecommendation = (recommendation: HomeDashboardRecommendation | null) => {
        if (
            !recommendation ||
            visitedIds.has(recommendation.id) ||
            usedIds.has(recommendation.id)
        ) {
            return;
        }

        usedIds.add(recommendation.id);
        recommendationCandidates.push(recommendation);
    };

    if (lastVisitTower?.gps) {
        const nearbyTowers = await getNearestTowers(
            lastVisitTower.id,
            lastVisitTower.gps.latitude,
            lastVisitTower.gps.longitude
        );

        nearbyTowers
            .filter((tower) => !visitedIds.has(tower.id))
            .slice(0, RECOMMENDATIONS_PER_TYPE_LIMIT)
            .map((tower) =>
                toRecommendation({
                    description:
                        getTowerDistanceLabel(lastVisitTower, tower) ||
                        "Kousek od poslední navštívené rozhledny.",
                    label: "Kousek od poslední navštívené",
                    reason: "last-visit-nearby",
                    tower,
                })
            )
            .forEach(addRecommendation);
    }

    const favouriteTowers = await Promise.all(
        favouriteTowerIds
            .filter((towerId) => !visitedIds.has(towerId))
            .slice(0, RECOMMENDATIONS_PER_TYPE_LIMIT)
            .map((towerId) => getTowerByID(towerId))
    );

    favouriteTowers
        .filter(Boolean)
        .map((tower) =>
            toRecommendation({
                description: tower.locationText || "Máte ji uloženou mezi oblíbenými.",
                label: "Z oblíbených",
                reason: "favourite-match",
                tower,
            })
        )
        .forEach(addRecommendation);

    (await getCyclingFriendlyTowers())
        .filter((tower) => !visitedIds.has(tower.id))
        .slice(0, RECOMMENDATIONS_PER_TYPE_LIMIT)
        .map((tower) =>
            toRecommendation({
                description:
                    "Má označení vhodné pro cyklisty, takže se hodí jako cíl výletu na kole.",
                label: "Vhodné na kolo",
                reason: "cycling-friendly",
                tower,
            })
        )
        .forEach(addRecommendation);

    (await getRecentlyOpenedTowers())
        .filter((tower) => isAlreadyOpened(tower) && !visitedIds.has(tower.id))
        .sort(
            (firstTower, secondTower) =>
                getOpenedTimestamp(secondTower) - getOpenedTimestamp(firstTower)
        )
        .slice(0, RECOMMENDATIONS_PER_TYPE_LIMIT)
        .map((tower) =>
            toRecommendation({
                description: "Jedna z nejnověji zpřístupněných rozhleden v katalogu.",
                label: "Nově otevřeno",
                reason: "newly-opened",
                tower,
            })
        )
        .forEach(addRecommendation);

    const randomTowers = await getRandomTowers(16);
    randomTowers
        .filter((tower) => !visitedIds.has(tower.id))
        .slice(0, RECOMMENDATIONS_PER_TYPE_LIMIT)
        .forEach((tower) => {
            addRecommendation(
                toRecommendation({
                    label: "Tip na další výpravu",
                    reason: "random",
                    tower,
                })
            );
        });

    return recommendationCandidates;
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

    const [user, visitedTowerIds, favouriteTowerIds, ratingsCount, progressTowers, lastVisit] =
        await Promise.all([
            getUserById(userId),
            getUserVisitedTowerIds(userId),
            getUserFavouriteTowerIds(userId),
            getCollectionCount("ratings", userId),
            getCzechTowersForProgress(),
            getLastUserVisit(userId),
        ]);
    const favouritesCount = favouriteTowerIds.length;
    const progress = getAccessibleTowerProgress(progressTowers, new Set(visitedTowerIds));
    const userLevel = getUserLevel(progress.visitedAccessibleCount);

    if (!lastVisit) {
        return {
            isAuthenticated: true,
            lastVisit: null,
            progress: {
                currentLevelColor: userLevel.color,
                currentLevelName: userLevel.name,
                currentLevelTextColor: userLevel.textColor,
                favouritesCount,
                levelProgressPercent: userLevel.progressPercent,
                nextLevelName: userLevel.nextLevel?.name ?? null,
                nextLevelVisits: userLevel.nextLevelVisits,
                progressPercent: progress.progressPercent,
                ratingsCount,
                remainingVisitsToNextLevel: userLevel.remainingVisits,
                totalAccessibleTowersCount: progress.totalAccessibleCount,
                visitsCount: progress.visitedAccessibleCount,
            },
            recommendations: [],
            user,
            visitedTowerIds,
        };
    }

    cacheTag(getCacheTagUserSpecific(CacheTag.UserTowerVisit, userId, lastVisit.tower_id));
    cacheTag(getCacheTagUserSpecific(CacheTag.UserTowerRating, userId, lastVisit.tower_id));

    const [tower, hasRating, photoUrl] = await Promise.all([
        getTowerByID(lastVisit.tower_id),
        hasUserRatingForTower(userId, lastVisit.tower_id),
        getLastVisitPhotoUrl(lastVisit),
    ]);
    const recommendations = await getRecommendations(favouriteTowerIds, tower, visitedTowerIds);

    return {
        isAuthenticated: true,
        lastVisit: {
            date: lastVisit.date,
            hasPhoto: Boolean(lastVisit.photoIds?.length),
            hasRating,
            photoUrl,
            tower,
        },
        progress: {
            currentLevelColor: userLevel.color,
            currentLevelName: userLevel.name,
            currentLevelTextColor: userLevel.textColor,
            favouritesCount,
            levelProgressPercent: userLevel.progressPercent,
            nextLevelName: userLevel.nextLevel?.name ?? null,
            nextLevelVisits: userLevel.nextLevelVisits,
            progressPercent: progress.progressPercent,
            ratingsCount,
            remainingVisitsToNextLevel: userLevel.remainingVisits,
            totalAccessibleTowersCount: progress.totalAccessibleCount,
            visitsCount: progress.visitedAccessibleCount,
        },
        recommendations,
        user,
        visitedTowerIds,
    };
});
