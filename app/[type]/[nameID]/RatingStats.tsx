"use client";
import React from "react";
import { Rating } from "react-simple-star-rating";

const RatingStats = (props: {}) => {
    //const colors = useThemeColors();

    return (
        <div className="flex flex-col justify-start items-center flex-1 md:flex-none gap-6 h-60 w-72">
            <div className="flex items-center gap-2">
                <h1 className="prose text-4xl text-primary">4,2</h1>
                <Rating
                    readonly
                    allowFraction
                    initialValue={4.2}
                    emptyClassName="flex"
                    SVGclassName="inline-block"
                    //fillColor={colors.primary}
                    //emptyColor={colors["base-content"]}
                    size={30}
                />
            </div>
            <div className="flex flex-col gap-1">
                {[5, 4, 3, 2, 1].map((item) => (
                    <div key={item} className="flex items-center">
                        <h2 className="text-xl font-bold text-primary">{item}</h2>
                        <Rating
                            readonly
                            initialValue={1}
                            //fillColor={colors.primary}
                            //emptyColor={colors["base-content"]}
                            iconsCount={1}
                            size={22}
                            className="mt-1"
                        />
                        <progress className="progress progress-primary w-48 ml-2" value={65} max="100"></progress>
                        <p className="text-sm opacity-50 ml-2">20%</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RatingStats;
