import "server-only";

import { AggregateField } from "firebase-admin/firestore";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { Tower } from "@/types/Tower";
import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";
import { db } from "@/utils/firebase-admin";
import { normalizeTowerObject } from "@/utils/normalizeTowerObject";

export const getTowerRatingAndCount = cache(
    async (towerID: string): Promise<{ avg: number; count: number }> => {
        "use cache";
        cacheLife("hours");
        cacheTag(CacheTag.TowerRatingAndCount);
        cacheTag(getCacheTagSpecific(CacheTag.TowerRatingAndCount, towerID));

        const aggregate = await db
            .collection("ratings")
            .where("tower_id", "==", towerID)
            .aggregate({
                reviewsCount: AggregateField.count(),
                reviewsAverage: AggregateField.average("rating"),
            })
            .get();

        const data = aggregate.data();
        const average = Number(data.reviewsAverage || 0);

        return {
            avg: Math.round(average * 2) / 2 || 0,
            count: Number(data.reviewsCount || 0),
        };
    }
);

export const getRandomTowers = cache(async (count: number): Promise<Tower[]> => {
    "use cache";
    cacheLife("hours");
    cacheTag(CacheTag.RandomTowers);

    const ids = new Set<string>();
    const towers: Tower[] = [];
    let threshold = Math.random();
    let canWrap = true;

    while (towers.length < count) {
        const remaining = count - towers.length;
        const snap = await db
            .collection("towers")
            .where("random", ">=", threshold)
            .orderBy("random")
            .limit(remaining)
            .get();

        if (snap.empty) {
            if (!canWrap) {
                break;
            }

            threshold = 0;
            canWrap = false;
            continue;
        }

        snap.forEach((doc) => {
            if (!ids.has(doc.id)) {
                ids.add(doc.id);
                towers.push(normalizeTowerObject(doc.data()));
            }
        });

        if (!canWrap || towers.length >= count) {
            break;
        }

        threshold = 0;
        canWrap = false;
    }

    return towers;
});

export const getTowerByID = cache(async (id: string): Promise<Tower> => {
    "use cache";
    cacheLife("days");
    cacheTag(CacheTag.Tower);
    cacheTag(getCacheTagSpecific(CacheTag.Tower, id));

    const snap = await db.collection("towers").doc(id).get();
    if (!snap.exists) {
        return null;
    }

    return normalizeTowerObject(snap.data());
});

export const getTowerObjectByNameID = cache(async (name_id: string): Promise<Tower> => {
    "use cache";
    cacheLife("days");
    cacheTag(CacheTag.Tower);
    cacheTag(getCacheTagSpecific(CacheTag.Tower, name_id));

    const snap = await db.collection("towers").where("nameID", "==", name_id).limit(1).get();
    if (snap.empty) {
        return null;
    }

    return normalizeTowerObject(snap.docs[0].data());
});

export const getTowersByIDs = async (ids: string[]): Promise<Tower[]> => {
    const towers = await Promise.all(ids.map((id) => getTowerByID(id)));
    return towers.filter(Boolean);
};

export const getTowerVisitsCount = cache(async (towerID: string): Promise<{ count: number }> => {
    "use cache";
    cacheLife("hours");
    cacheTag(CacheTag.TowerVisitsCount);
    cacheTag(getCacheTagSpecific(CacheTag.TowerVisitsCount, towerID));

    const snap = await db.collection("visits").where("tower_id", "==", towerID).count().get();

    return {
        count: snap.data().count || 0,
    };
});
