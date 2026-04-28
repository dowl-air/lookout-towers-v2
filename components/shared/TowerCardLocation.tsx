"use client";

import { getDistance } from "geolib";

import useLocation from "@/hooks/useLocation";
import { Tower } from "@/types/Tower";
import { cn } from "@/utils/cn";
import { formatDistance } from "@/utils/geo";

const TowerCardLocation = ({ gps, className }: { gps: Tower["gps"]; className?: string }) => {
    const { location } = useLocation();

    if (!location) {
        return null;
    }

    const distance = getDistance(location, gps, 100);

    return (
        <div className={cn("whitespace-nowrap text-sm text-base-content/70", className)}>
            {formatDistance(distance)}
        </div>
    );
};

export default TowerCardLocation;
