import React from "react";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";

import { db } from "../firebase";
import ImageSlider from "../SwipableCarousel";
import { Tower, TowerFirebase } from "@/typings";
import { normalizeTowerObject } from "@/utils/normalizeTowerObject";
import Stats from "../Stats";
import AboutMe from "../AboutMe";
import Navbar from "../../components/navbar/Navbar";
import Hero from "../Hero";
import Footer from "../Footer";
import NotFinishedWeb from "@/components/warnings/NotFinishedWeb";

// every 1 hour new towers
export const revalidate = 3600;

const getTowerRatingAndCount = async (towerID: string) => {
    const ratings = collection(db, "ratings");
    const q = query(ratings, where("tower_id", "==", towerID));
    const snap = await getDocs(q);
    const data: number[] = [];
    snap.forEach((s) => data.push(s.data().value));
    if (data.length === 0) return { avg: 0, count: 0 };
    const average = data.reduce((p, c) => p + c) / data.length;
    const averageRound = Math.round(average * 2) / 2;
    return { avg: averageRound, count: data.length };
};

const getEightRandomTowers = async (): Promise<Tower[]> => {
    // get 8 random towers
    const ids: string[] = [];
    const towers: Tower[] = [];
    while (towers.length < 12) {
        const rnd = Math.random();
        const q = query(collection(db, "towers"), where("random", ">", rnd), orderBy("random"), limit(1));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            if (!(doc.id in ids)) towers.push(normalizeTowerObject(doc.data() as TowerFirebase));
        });
    }
    // get rating for each tower
    const promises: Promise<{ avg: number; count: number }>[] = [];
    for (let id in towers) promises.push(getTowerRatingAndCount(id));
    const res = await Promise.all(promises);
    res.forEach((elm, idx) => {
        towers[idx].rating = elm;
    });
    return towers;
};

async function HomePage() {
    const towers: Tower[] = await getEightRandomTowers();
    return (
        <div className="flex flex-col justify-center">
            <Hero />
            <NotFinishedWeb />
            <ImageSlider towers={towers} data-superjson />
            <Stats />
            <AboutMe />
            <Footer />
        </div>
    );
}

export default HomePage;
