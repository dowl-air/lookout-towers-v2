import { Suspense } from "react";

import AboutMe from "@/components/homepage/AboutMe";
import Hero from "@/components/homepage/Hero";
import ImageSlider from "@/components/homepage/ImageSlider";
import ImageSliderSkeleton from "@/components/homepage/ImageSliderSkeleton";
import Stats from "@/components/homepage/Stats";
import StatsSkeleton from "@/components/homepage/StatsSkeleton";
import TowerOfTheDay from "@/components/homepage/TowerOfTheDay";
import { getRandomTowers, getTowerRatingAndCount } from "@/data/tower/towers";

async function HomePage() {
    const towers = await getRandomTowers(12);
    const ratings = await Promise.all(towers.map((tower) => getTowerRatingAndCount(tower.id)));

    return (
        <div className="flex flex-col justify-center">
            <Hero />
            <section className="mx-auto mt-12 flex w-full max-w-[1070px] flex-col px-4">
                <div className="mb-5 flex flex-col gap-2 text-center md:text-left">
                    <h2 className="text-3xl font-bold md:text-4xl">Náhodný výběr</h2>
                    <p className="text-base-content/75 text-base md:text-lg">
                        Inspirace na další výlet z právě vybraných míst v databázi.
                    </p>
                </div>
            </section>
            <Suspense fallback={<ImageSliderSkeleton />}>
                <ImageSlider towers={towers} ratings={ratings} />
            </Suspense>
            <section className="mx-auto mt-16 flex w-full max-w-[1070px] flex-col px-4">
                <div className="mb-5 flex flex-col gap-2 text-center md:text-left">
                    <h2 className="text-3xl font-bold md:text-4xl">Komunita v číslech</h2>
                    <p className="text-base-content/75 text-base md:text-lg">
                        Rychlý přehled o růstu databáze i aktivitě celé komunity.
                    </p>
                </div>
            </section>
            <Suspense fallback={<StatsSkeleton />}>
                <Stats />
            </Suspense>
            <TowerOfTheDay />
            <AboutMe />
        </div>
    );
}

export default HomePage;
