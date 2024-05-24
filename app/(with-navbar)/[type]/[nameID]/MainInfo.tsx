import React from "react";
import Buttons from "./Buttons";
import RatingTop from "./RatingTop";
import Legend from "./Legend";
import { Tower } from "@/typings";
import LocationBreadcrumbs from "./LocationBreadcrumbs";

function MainInfo({ tower, count, average }: { tower: Tower; count: number; average: number }) {
    return (
        <div className="prose prose-xl max-w-screen-sm flex flex-col flex-1 pl-4">
            <LocationBreadcrumbs tower={tower} />
            <h1>{tower.name}</h1>
            <Legend tower={tower} />

            <RatingTop count={count} average={average} />
            <div className="flex flex-col justify-center gap-2">
                <Buttons tower={tower} />
            </div>
        </div>
    );
}

export default MainInfo;
