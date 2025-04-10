"use client";
import ThemedRating from "@/components/shared/ThemedRating";

const RatingTop = ({ count, average }: { count: number; average: number }) => {
    const scroll_ = () => document?.querySelector("#tower-rating-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
    return (
        <>
            <div onClick={scroll_} className="mt-2 block sm:hidden">
                <ThemedRating value={average} size={25} className="cursor-pointer" />
            </div>
            <div onClick={scroll_} className="mt-3 hidden sm:block lg:hidden">
                <ThemedRating value={average} size={25} className="cursor-pointer" />
            </div>
            <div onClick={scroll_} className="mt-4 hidden lg:block">
                <ThemedRating value={average} size={45} className="mt-9 cursor-pointer" />
            </div>
            <p className="text-xs sm:text-sm mt-0! mb-3! pl-1 cursor-pointer" onClick={() => scroll()}>
                {count ? `Hodnoceno ${count}x` : "Zatím nikdo nehodnotil."}
            </p>
        </>
    );
};

export default RatingTop;
