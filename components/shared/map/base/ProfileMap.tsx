"use client";

import { Tower } from "@/types/Tower";
import MapBase from "@/components/shared/map/base/MapBase";
import { Visit } from "@/types/Visit";
import TowerMarker from "@/components/shared/map/base/TowerMarker";
import { useMapEvents } from "react-leaflet";
import { useEffect } from "react";

const MapEvents = ({ bounds }: { bounds: { latitude: number; longitude: number }[] }) => {
    const map = useMapEvents({});
    useEffect(() => {
        if (bounds.length > 0) {
            map.fitBounds(bounds.map((b) => [b.latitude, b.longitude]));
        }
    }, [bounds]);
    return null;
};

const TowerMap = ({ towers, visits, favourites }: { towers: Tower[]; visits: Visit[]; favourites: string[] }) => {
    return (
        <div className="mx-auto w-full h-full rounded-xl mb-5 overflow-hidden touch-none">
            <MapBase>
                {towers.map((tower) => {
                    const isVisited = visits.some((visit) => visit.tower_id === tower.id);
                    const isFavourite = favourites.includes(tower.id);

                    if (!isVisited && !isFavourite) {
                        return null;
                    }

                    return <TowerMarker key={tower.id} tower={tower} isFavourite={isFavourite} isVisited={isVisited} />;
                })}
                <MapEvents bounds={towers.map((t) => t.gps)} />
            </MapBase>
        </div>
    );
};

export default TowerMap;
