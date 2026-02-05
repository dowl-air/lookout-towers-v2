"use client";

import { getDistance } from "geolib";

import { TowerMapDTO } from "@/data/tower/towers-map";
import useLocation from "@/hooks/useLocation";
import { Tower } from "@/types/Tower";
import { formatDistance } from "@/utils/geo";

const TowerCardLocation = ({ tower }: { tower: Tower | TowerMapDTO }) => {
    const { location } = useLocation();
    if (!location) {
        return null;
    }
    const distance = getDistance(location, tower.gps, 100);
    return (
        <div className="whitespace-nowrap text-black opacity-80">{formatDistance(distance)}</div>
    );
};

export default TowerCardLocation;
