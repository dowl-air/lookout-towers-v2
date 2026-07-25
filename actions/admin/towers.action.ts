"use server";

import { updateTag } from "next/cache";

import { checkAdmin } from "@/actions/checkAdmin";
import { trackAnalyticsEvent } from "@/utils/analytics.server";
import { CacheTag, getCacheTagSpecific, getCacheTagUserSpecific } from "@/utils/cacheTags";
import { db, storageBucket } from "@/utils/firebase-admin";
import { isTowerDeletionConfirmed } from "@/utils/towerDeletion";

export type RemoveTowerActionState = {
    error?: string;
    success?: boolean;
};

const deleteDocuments = async (references: FirebaseFirestore.DocumentReference[]) => {
    for (let index = 0; index < references.length; index += 500) {
        const batch = db.batch();
        references.slice(index, index + 500).forEach((reference) => batch.delete(reference));
        await batch.commit();
    }
};

export const removeTower = async (
    towerId: string,
    confirmation: string
): Promise<RemoveTowerActionState> => {
    if (!(await checkAdmin())) {
        return { error: "K této akci nemáte oprávnění." };
    }

    if (!towerId || typeof confirmation !== "string") {
        return { error: "Neplatné údaje pro odstranění rozhledny." };
    }

    const towerRef = db.collection("towers").doc(towerId);
    const towerSnapshot = await towerRef.get();
    if (!towerSnapshot.exists) {
        return { error: "Rozhledna nebyla nalezena." };
    }

    const tower = towerSnapshot.data();
    if (typeof tower.name !== "string" || !isTowerDeletionConfirmed(tower.name, confirmation)) {
        return { error: "Pro potvrzení zadejte přesný název rozhledny." };
    }

    const [photos, favourites, ratings, visits, changes] = await Promise.all([
        db.collection("photos").where("tower_id", "==", towerId).get(),
        db.collection("favourites").where("tower_id", "==", towerId).get(),
        db.collection("ratings").where("tower_id", "==", towerId).get(),
        db.collection("visits").where("tower_id", "==", towerId).get(),
        db.collection("changes").where("tower_id", "==", towerId).get(),
    ]);

    await Promise.all([
        storageBucket.deleteFiles({ prefix: `towers/${towerId}/` }),
        storageBucket.deleteFiles({ prefix: `towers_users/${towerId}/` }),
    ]);

    await deleteDocuments([
        ...photos.docs.map((document) => document.ref),
        ...favourites.docs.map((document) => document.ref),
        ...ratings.docs.map((document) => document.ref),
        ...visits.docs.map((document) => document.ref),
        ...changes.docs.map((document) => document.ref),
        towerRef,
    ]);

    updateTag(CacheTag.Towers);
    updateTag(CacheTag.TowersMap);
    updateTag(CacheTag.TowersCount);
    updateTag(CacheTag.LastChangeDate);
    updateTag(CacheTag.RandomTowers);
    updateTag(CacheTag.TowerOfTheDay);
    updateTag(CacheTag.RatingsCount);
    updateTag(CacheTag.VisitsCount);
    updateTag(CacheTag.ChangesCount);
    updateTag(CacheTag.UnresolvedChanges);
    updateTag(getCacheTagSpecific(CacheTag.Tower, towerId));
    updateTag(getCacheTagSpecific(CacheTag.Tower, tower.nameID));
    updateTag(getCacheTagSpecific(CacheTag.TowerGallery, towerId));
    updateTag(getCacheTagSpecific(CacheTag.TowerPhotos, towerId));
    updateTag(getCacheTagSpecific(CacheTag.TowerRatingAndCount, towerId));
    updateTag(getCacheTagSpecific(CacheTag.TowerRatings, towerId));
    updateTag(getCacheTagSpecific(CacheTag.TowerVisits, towerId));
    updateTag(getCacheTagSpecific(CacheTag.TowerVisitsCount, towerId));
    updateTag(getCacheTagSpecific(CacheTag.ChangesTower, towerId));

    favourites.docs.forEach((document) => {
        const userId = document.get("user_id");
        if (typeof userId === "string") {
            updateTag(getCacheTagSpecific(CacheTag.UserFavourites, userId));
            updateTag(getCacheTagUserSpecific(CacheTag.TowerFavourite, userId, towerId));
        }
    });
    ratings.docs.forEach((document) => {
        const userId = document.get("user_id");
        if (typeof userId === "string") {
            updateTag(getCacheTagSpecific(CacheTag.UserRatings, userId));
            updateTag(getCacheTagUserSpecific(CacheTag.UserTowerRating, userId, towerId));
        }
    });
    visits.docs.forEach((document) => {
        const userId = document.get("user_id");
        if (typeof userId === "string") {
            updateTag(getCacheTagSpecific(CacheTag.UserVisits, userId));
            updateTag(getCacheTagUserSpecific(CacheTag.UserTowerVisit, userId, towerId));
        }
    });
    changes.docs.forEach((document) => {
        const userId = document.get("user_id");
        if (typeof userId === "string") {
            updateTag(getCacheTagSpecific(CacheTag.ChangesUser, userId));
        }
        updateTag(getCacheTagSpecific(CacheTag.Change, document.id));
    });

    void trackAnalyticsEvent("Tower deleted", {
        favourites: favourites.size,
        photos: photos.size,
        ratings: ratings.size,
        visits: visits.size,
    });

    return { success: true };
};
