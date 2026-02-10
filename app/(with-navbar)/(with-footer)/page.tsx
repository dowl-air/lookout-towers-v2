import { Suspense } from "react";

import { getRandomTowers, getTowerRatingAndCount } from "@/actions/towers/towers.action";
import AboutMe from "@/components/homepage/AboutMe";
import Hero from "@/components/homepage/Hero";
import ImageSlider from "@/components/homepage/ImageSlider";
import ImageSliderSkeleton from "@/components/homepage/ImageSliderSkeleton";
import Stats from "@/components/homepage/Stats";
import StatsSkeleton from "@/components/homepage/StatsSkeleton";
import TowerOfTheDay from "@/components/homepage/TowerOfTheDay";
import NotFinishedWeb from "@/components/warnings/NotFinishedWeb";

async function HomePage() {
    const towers = await getRandomTowers(12);
    const ratings = await Promise.all(towers.map((tower) => getTowerRatingAndCount(tower.id)));

    return (
        <div className="flex flex-col justify-center">
            <Hero />
            <NotFinishedWeb />
            <Suspense fallback={<ImageSliderSkeleton />}>
                <ImageSlider towers={towers} ratings={ratings} />
            </Suspense>
            <Suspense fallback={<StatsSkeleton />}>
                <Stats />
            </Suspense>
            <TowerOfTheDay />
            <AboutMe />
        </div>
    );
}

export default HomePage;
