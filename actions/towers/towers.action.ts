"use server";

import { db } from "@/app/firebase";
import { Tower, TowerFirebase } from "@/typings";
import { normalizeTowerObject } from "@/utils/normalizeTowerObject";
import { collection, getAggregateFromServer, getDocs, limit, orderBy, query, where, count, average } from "firebase/firestore";

export const getTowerRatingAndCount = async (towerID: string) => {
    const q = query(collection(db, "ratings"), where("tower_id", "==", towerID));
    const agg = await getAggregateFromServer(q, {
        reviewsCount: count(),
        reviewsAverage: average("value")
    });
    const data = agg.data();
    return {
        avg: Math.round(data.reviewsAverage * 2) / 2 || 0,
        count: data.reviewsCount || 0
    };
};

export const getRandomTowers = async (count: number): Promise<Tower[]> => {
    const ids: Set<string> = new Set();
    const towers: Tower[] = [];
    while (towers.length < count) {
        const rnd = Math.random();
        const q = query(
            collection(db, "towers"),
            where("random", ">", rnd),
            orderBy("random"),
            limit(count - towers.length)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            if (!ids.has(doc.id)) {
                ids.add(doc.id);
                towers.push(normalizeTowerObject(doc.data() as TowerFirebase));
            }
        });
    }

    const promises: Promise<{ avg: number; count: number }>[] = towers.map(tower => getTowerRatingAndCount(tower.id));
    const ratings = await Promise.all(promises);
    ratings.forEach((rating, idx) => {
        towers[idx].rating = rating;
    });

    return towers;
};


