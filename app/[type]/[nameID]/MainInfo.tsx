import React from "react";
import Buttons from "./Buttons";
import RatingTop from "./RatingTop";
import Legend from "./Legend";
import { Tower } from "@/typings";
import LocationBreadcrumbs from "./LocationBreadcrumbs";

function MainInfo({ tower }: { tower: Tower }) {
    return (
        <div className="prose prose-xl max-w-screen-sm flex flex-col flex-1 pl-4">
            <LocationBreadcrumbs tower={tower} />
            <h1>{tower.name}</h1>
            <Legend tower={tower} />

            <RatingTop towerID={tower.id} />
            <div className="flex flex-col justify-center gap-2">
                <Buttons towerID={tower.id} />
            </div>
        </div>
    );
}

export default MainInfo;
