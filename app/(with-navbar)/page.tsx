import AboutMe from "@/components/homepage/AboutMe";
import Stats from "@/components/homepage/Stats";
import Hero from "@/components/homepage/Hero";
import NotFinishedWeb from "@/components/warnings/NotFinishedWeb";
import ImageSlider from "@/components/homepage/ImageSlider";
import { getRandomTowers } from "@/actions/towers/towers.action";
import TowerOfTheDay from "@/components/homepage/TowerOfTheDay";

export const revalidate = 3600;

async function HomePage() {
    const towers = await getRandomTowers(12);
    return (
        <div className="flex flex-col justify-center">
            <Hero />
            <NotFinishedWeb />
            <ImageSlider towers={towers} />
            <Stats />
            <TowerOfTheDay />
            <AboutMe />
        </div>
    );
}

export default HomePage;
