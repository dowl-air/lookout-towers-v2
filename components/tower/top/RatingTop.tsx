"use client";
import ThemedRating from "@/components/shared/ThemedRating";

const RatingTop = ({ count, average }: { count: number; average: number }) => {
    const scroll_ = () => document?.querySelector("#tower-rating-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
    return (
        <>
            <div onClick={scroll_} className="mt-4">
                <ThemedRating value={average} size={45} className="lg:mt-9 cursor-pointer" />
            </div>
            <p className="text-sm mt-0 pl-1 cursor-pointer" onClick={() => scroll()}>
                {count ? `Hodnoceno ${count}x` : "Zatím nikdo nehodnotil."}
            </p>
        </>
    );
};

export default RatingTop;
