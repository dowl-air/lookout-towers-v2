import AboutMe from "@/components/homepage/AboutMe";
import Stats from "@/components/homepage/Stats";
import Hero from "@/components/homepage/Hero";
import NotFinishedWeb from "@/components/warnings/NotFinishedWeb";
import ImageSlider from "@/components/homepage/ImageSlider";
import { getRandomTowers, getTowerRatingAndCount } from "@/actions/towers/towers.action";
import TowerOfTheDay from "@/components/homepage/TowerOfTheDay";

async function HomePage() {
    const towers = await getRandomTowers(12);
    const ratings = await Promise.all(towers.map((tower) => getTowerRatingAndCount(tower.id)));
    return (
        <div className="flex flex-col justify-center">
            <Hero />
            <NotFinishedWeb />
            <ImageSlider towers={towers} ratings={ratings} />
            <Stats />
            <TowerOfTheDay />
            <AboutMe />
        </div>
    );
}

export default HomePage;
