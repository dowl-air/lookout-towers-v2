"use server";

import { collection, getAggregateFromServer, getDocs, limit, orderBy, query, where, count, average, getDoc, doc } from "firebase/firestore";
import { unstable_cache as cache } from "next/cache";
import { db } from "@/utils/firebase";
import { normalizeTowerObject } from "@/utils/normalizeTowerObject";
import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";
import { Tower } from "@/types/Tower";

export const getTowerRatingAndCount = async (towerID: string): Promise<{ avg: number; count: number }> => {
    const cachedFn = cache(
        async (towerID: string) => {
            const q = query(collection(db, "ratings"), where("tower_id", "==", towerID));
            const agg = await getAggregateFromServer(q, {
                reviewsCount: count(),
                reviewsAverage: average("rating"),
            });
            const data = agg.data();
            return {
                avg: Math.round(data.reviewsAverage * 2) / 2 || 0,
                count: data.reviewsCount || 0,
            };
        },
        [CacheTag.TowerRatingAndCount],
        {
            tags: [CacheTag.TowerRatingAndCount, getCacheTagSpecific(CacheTag.TowerRatingAndCount, towerID)],
        }
    );
    return cachedFn(towerID);
};

export const getRandomTowers = cache(
    async (count: number): Promise<Tower[]> => {
        const ids: Set<string> = new Set();
        const towers: Tower[] = [];
        while (towers.length < count) {
            const rnd = Math.random();
            const q = query(collection(db, "towers"), where("random", ">", rnd), orderBy("random"), limit(count - towers.length));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                if (!ids.has(doc.id)) {
                    ids.add(doc.id);
                    towers.push(normalizeTowerObject(doc.data()));
                }
            });
        }
        return towers;
    },
    [CacheTag.RandomTowers],
    {
        revalidate: 60 * 60 * 2,
        tags: [CacheTag.RandomTowers],
    }
);

export const getAllTowers = cache(
    async (): Promise<Tower[]> => {
        const towers: Tower[] = [];
        const querySnapshot = await getDocs(collection(db, "towers"));
        querySnapshot.forEach((doc) => {
            towers.push(normalizeTowerObject(doc.data()));
        });
        return towers;
    },
    [CacheTag.Towers],
    {
        tags: [CacheTag.Towers],
        revalidate: 60 * 60 * 24 * 7, // revalidate once a week (backup in case of a bug in the cache tag mechanism)
    }
);

export const getTowerByID = async (id: string): Promise<Tower> => {
    const cachedFn = cache(
        async (id: string) => {
            const docSnap = await getDoc(doc(db, "towers", id));
            return normalizeTowerObject(docSnap.data());
        },
        [CacheTag.Tower],
        {
            tags: [CacheTag.Tower, getCacheTagSpecific(CacheTag.Tower, id)],
        }
    );
    return cachedFn(id);
};

export const getTowerObjectByNameID = async (name_id: string): Promise<Tower> => {
    const cachedFn = cache(
        async (name_id: string) => {
            const q = query(collection(db, "towers"), where("nameID", "==", name_id), limit(1));
            const snap = await getDocs(q);
            if (snap.empty) {
                return null;
            }
            const doc = snap.docs[0];
            return normalizeTowerObject(doc.data());
        },
        [CacheTag.Tower],
        {
            tags: [CacheTag.Tower, getCacheTagSpecific(CacheTag.Tower, name_id)],
        }
    );
    return cachedFn(name_id);
};

export const getTowersByIDs = async (ids: string[]): Promise<Tower[]> => {
    // caching is not necessary here, because the cache is already used in the getTowerByID function
    const promises = ids.map((id) => getTowerByID(id));
    const towers = await Promise.all(promises);
    return towers;
};

export const getTowerOfTheDay = cache(
    async (): Promise<Tower> => {
        const today = new Date();
        const seedValue = parseInt(
            `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, "0")}${today.getDate().toString().padStart(2, "0")}`
        );
        const seededRandom = (seed: number) => {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };
        const generatedRandom = seededRandom(seedValue);
        const q = query(collection(db, "towers"), orderBy("random"), where("random", ">=", generatedRandom), limit(1));
        const snap = await getDocs(q);
        const doc = snap.docs[0];
        return normalizeTowerObject(doc.data());
    },
    [CacheTag.TowerOfTheDay],
    {
        revalidate: 60 * 60,
        tags: [CacheTag.TowerOfTheDay],
    }
);

export const getTowerVisitsCount = async (towerID: string) => {
    const cachedFn = cache(
        async (towerID: string) => {
            const q = query(collection(db, "visits"), where("tower_id", "==", towerID));
            const agg = await getAggregateFromServer(q, {
                reviewsCount: count(),
            });
            const data = agg.data();
            return {
                count: data.reviewsCount || 0,
            };
        },
        [CacheTag.TowerVisitsCount],
        {
            tags: [CacheTag.TowerVisitsCount, getCacheTagSpecific(CacheTag.TowerVisitsCount, towerID)],
        }
    );
    return cachedFn(towerID);
};
