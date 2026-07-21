"use client";

import { getDistance } from "geolib";
import { MapPinned } from "lucide-react";

import useLocation from "@/hooks/useLocation";
import { formatDistance } from "@/utils/geo";

const MapDistance = ({ latitude, longitude }: { latitude: number; longitude: number }) => {
    const { location, permissionState } = useLocation();

    if (!location || permissionState !== "granted") return null;

    const distance = getDistance(location, { latitude, longitude }, 100);

    return (
        <div className="flex items-center gap-2 text-sm font-medium text-base-content/70">
            <MapPinned className="size-4 text-primary" />
            <span>{formatDistance(distance)} od vás</span>
        </div>
    );
};

export default MapDistance;
