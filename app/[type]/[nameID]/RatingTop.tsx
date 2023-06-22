"use client";
import getAndCountTowerRating from "@/utils/getAndCountTowerRating";
//import { getThemeColors } from "@/utils/getThemeColors";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { Rating } from "react-simple-star-rating";

const RatingTop = async ({ towerID }: { towerID: string }) => {
    /*     const { theme } = useTheme();
    const colors = getThemeColors(theme || "light"); */
    const [ratingCount, setRatingCount] = useState(0);
    const [ratingAverage, setRatingAverage] = useState(0);

    /*     useEffect(() => {
        const d = async () => {
            const { count, average } = await getAndCountTowerRating(towerID);
            setRatingAverage(average);
            setRatingCount(count);
        };
        d();
        console.log("hello");
    }, [towerID]); */

    const scroll = () => document?.querySelector("#rating_box")?.scrollIntoView({ behavior: "smooth", block: "start" });

    return (
        <div>
            <div onClick={() => scroll()}>
                <Rating
                    readonly
                    allowFraction
                    initialValue={ratingAverage}
                    emptyClassName="flex"
                    SVGclassName="inline-block"
                    //fillColor={colors.primary}
                    //emptyColor={colors["base-content"]}
                    size={45}
                    className="lg:mt-9 cursor-pointer"
                />
            </div>
            <p className="text-sm mt-0 pl-1 cursor-pointer" onClick={() => scroll()}>
                {ratingCount ? `Hodnoceno ${ratingCount}x` : "Zatím nikdo nehodnotil."}
            </p>
        </div>
    );
};

export default RatingTop;
