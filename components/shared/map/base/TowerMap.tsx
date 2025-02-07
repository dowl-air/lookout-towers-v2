"use client";

import { Tower } from "@/types/Tower";
import { Marker } from "react-leaflet";
import { defaultIcon } from "@/components/shared/map/base/icons";
import MapBase from "@/components/shared/map/base/MapBase";

const TowerMap = ({ tower }: { tower: Tower }) => {
    return (
        <div className="mx-auto w-full max-w-7xl h-96 sm:h-[30rem] lg:h-[34rem] rounded-xl mb-5 overflow-hidden touch-none">
            <MapBase center={{ lat: tower.gps.latitude, lng: tower.gps.longitude }} zoom={12}>
                <Marker position={{ lat: tower.gps.latitude, lng: tower.gps.longitude }} icon={defaultIcon} title={tower.name} />
            </MapBase>
        </div>
    );
};

export default TowerMap;
