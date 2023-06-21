import { Tower } from "@/typings";
import React from "react";
import LocationBreadcrumbs from "./LocationBreadcrumbs";
import Legend from "./Legend";
import Carousel from "./Carousel";
import RatingTop from "./RatingTop";
import Buttons from "./Buttons";

type Props = {
    tower: Tower;
    images: string[];
};

function MainInfoPhone({ tower, images }: Props) {
    return (
        <div className="flex flex-col flex-1 lg:hidden">
            <LocationBreadcrumbs tower={tower} />
            <div className="flex justify-center items-center gap-3 mx-3 flex-wrap">
                <div className="flex flex-col prose sm:prose-lg max-w-sm min-[751px]:max-w-[350px] min-[821px]:max-w-[420px]">
                    <h1>{tower.name}</h1>
                    <Legend tower={tower} />
                </div>
                <Carousel images={images} phone />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
                <RatingTop />
                <div className="flex flex-wrap justify-center gap-2 mx-3">
                    <Buttons towerID={tower.id} />
                </div>
            </div>
        </div>
    );
}

export default MainInfoPhone;
