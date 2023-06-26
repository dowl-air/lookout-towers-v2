"use client";
import { getThemeColors } from "@/utils/getThemeColors";
import { useTheme } from "next-themes";
import React from "react";
import { Rating } from "react-simple-star-rating";

const RatingTop = ({ count, average }: { count: number; average: number }) => {
    const { theme } = useTheme();
    const colors = getThemeColors(theme);

    const scroll_ = () => document?.querySelector("#rating_box")?.scrollIntoView({ behavior: "smooth", block: "start" });

    return (
        <div>
            <div onClick={() => scroll_()}>
                <Rating
                    readonly
                    allowFraction
                    initialValue={average}
                    emptyClassName="flex"
                    SVGclassName="inline-block"
                    fillColor={colors ? colors.primary : ""}
                    emptyColor={colors ? colors["base-content"] : ""}
                    size={45}
                    className="lg:mt-9 cursor-pointer"
                />
            </div>
            <p className="text-sm mt-0 pl-1 cursor-pointer" onClick={() => scroll()}>
                {count ? `Hodnoceno ${count}x` : "Zatím nikdo nehodnotil."}
            </p>
        </div>
    );
};

export default RatingTop;
