import AboutMe from "@/components/homepage/AboutMe";
import Hero from "@/components/homepage/Hero";
import ImageSliderSkeleton from "@/components/homepage/ImageSliderSkeleton";
import NotFinishedWeb from "@/components/warnings/NotFinishedWeb";

const Loading = () => {
    return (
        <div className="flex flex-col justify-center">
            <Hero />
            <NotFinishedWeb />
            <ImageSliderSkeleton />
            <AboutMe />
        </div>
    );
};

export default Loading;
