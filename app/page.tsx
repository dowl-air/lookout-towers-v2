import React from "react";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";

import { db } from "./firebase";
import ImageSlider from "./SwipableCarousel";
import { Tower } from "@/typings";
import { normalizeTowerObject } from "@/utils/normalizeTowerObject";

// every 10 mins new towers
export const revalidate = 600;

// get 8 random towers
const getEightRandomTowers = async (): Promise<Tower[]> => {
    const ids: string[] = [];
    const towers: Tower[] = [];
    while (towers.length < 8) {
        const rnd = Math.random();
        const q = query(collection(db, "towers"), where("random", ">", rnd), orderBy("random"), limit(1));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            if (!(doc.id in ids)) towers.push(normalizeTowerObject(doc.data() as Tower));
        });
    }
    return towers;
};

async function HomePage() {
    const towers: Tower[] = await getEightRandomTowers();
    return (
        <div>
            <ImageSlider towers={towers} data-superjson />
        </div>
    );
}

export default HomePage;
