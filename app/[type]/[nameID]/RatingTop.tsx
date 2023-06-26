"use client";
import React from "react";
import ThemedRating from "./ThemedRating";

const RatingTop = ({ count, average }: { count: number; average: number }) => {
    const scroll_ = () => document?.querySelector("#rating_box")?.scrollIntoView({ behavior: "smooth", block: "start" });

    return (
        <div>
            <div onClick={() => scroll_()}>
                <ThemedRating value={average} size={45} className="lg:mt-9 cursor-pointer" />
            </div>
            <p className="text-sm mt-0 pl-1 cursor-pointer" onClick={() => scroll()}>
                {count ? `Hodnoceno ${count}x` : "Zatím nikdo nehodnotil."}
            </p>
        </div>
    );
};

export default RatingTop;
