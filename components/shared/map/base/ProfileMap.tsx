"use client";

import { Tower } from "@/types/Tower";
import MapBase from "@/components/shared/map/base/MapBase";
import { Visit } from "@/types/Visit";
import TowerMarker from "@/components/shared/map/base/TowerMarker";

const TowerMap = ({ towers, visits, favourites }: { towers: Tower[]; visits: Visit[]; favourites: string[] }) => {
    return (
        <div className="mx-auto w-full max-w-7xl h-96 sm:h-[30rem] lg:h-[34rem] rounded-xl mb-5 overflow-hidden touch-none">
            <MapBase center={{ lat: 49.8237572, lng: 15.6086383 }} zoom={8}>
                {towers.map((tower) => {
                    const isVisited = visits.some((visit) => visit.tower_id === tower.id);
                    const isFavourite = favourites.includes(tower.id);

                    if (!isVisited && !isFavourite) {
                        return null;
                    }

                    return <TowerMarker key={tower.id} tower={tower} isFavourite={isFavourite} isVisited={isVisited} />;
                })}
            </MapBase>
        </div>
    );
};

export default TowerMap;
