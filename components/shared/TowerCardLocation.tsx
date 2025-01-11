"use client";

import useLocation from "@/hooks/useLocation";
import { Tower } from "@/typings";
import { formatDistance } from "@/utils/geo";
import { getDistance } from "geolib";

const TowerCardLocation = ({ tower }: { tower: Tower }) => {
    const { location } = useLocation();
    if (!location) {
        return null;
    }
    const distance = getDistance(location, tower.gps, 100);
    return <div>{formatDistance(distance)}</div>;
};

export default TowerCardLocation;
