import React from "react";
import ThemedRating from "./ThemedRating";
import { Rating } from "@/typings";

const getAverage = (reviews: Rating[]): number => {
    const numbers = reviews.map((r) => r.rating);
    return reviews.length ? numbers.reduce((a, b) => a + b) / reviews.length : 0;
};

const getRange = (reviews: Rating[], range: number): number => {
    if (reviews.length == 0) return 0;
    const filtered = reviews.filter((r) => r.rating >= range - 0.5 && r.rating <= range);
    return (filtered.length / reviews.length) * 100;
};

const RatingStats = ({ reviews }: { reviews: Rating[] }) => {
    return (
        <div className="flex flex-col justify-center items-center md:flex-none gap-6 md:mr-8">
            <div className="flex items-center gap-2">
                <h1 className="prose text-4xl text-primary">{getAverage(reviews).toPrecision(2)}</h1>
                <ThemedRating value={getAverage(reviews)} size={30} iconsCount={5} />
            </div>
            <div className="flex flex-col gap-2">
                {[5, 4, 3, 2, 1].map((item) => (
                    <div key={item} className="flex items-center gap-1">
                        <h2 className="text-xl font-bold text-primary">{item}</h2>
                        <ThemedRating value={1} iconsCount={1} size={22} />
                        <progress className="progress progress-primary w-48 ml-2" value={getRange(reviews, item)} max="100"></progress>
                        <p className="text-sm opacity-50 ml-2">{`${getRange(reviews, item)}%`}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RatingStats;
