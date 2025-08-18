"use client";

import { Tower } from "@/types/Tower";
import { Visit } from "@/types/Visit";
import TowerMarker from "@/components/shared/map/base/TowerMarker";
import LocationMarker from "@/components/shared/map/base/LocationMarker";
import MapBase from "@/components/shared/map/base/MapBase";
import useLocation from "@/hooks/useLocation";

const MainMap = ({ towers, visits, favourites }: { towers: Tower[]; visits: Visit[]; favourites: string[] }) => {
    const { location } = useLocation();

    return (
        <MapBase center={{ lat: 49.8237572, lng: 15.6086383 }} zoom={8}>
            {towers.map((tower) => {
                const isVisited = visits.some((visit) => visit.tower_id === tower.id);
                const isFavourite = favourites.includes(tower.id);

                return <TowerMarker key={tower.id} tower={tower} isFavourite={isFavourite} isVisited={isVisited} />;
            })}

            {location && <LocationMarker position={location} />}
        </MapBase>
    );
};

export default MainMap;
