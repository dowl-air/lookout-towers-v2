import { DEFAULT_MAP_CONFIG } from "@/constants/map-config";

export type MapViewport = {
    center: [number, number];
    zoom: number;
};

const isInRange = (value: number, minimum: number, maximum: number) => {
    return Number.isFinite(value) && value >= minimum && value <= maximum;
};

const formatCoordinate = (coordinate: number) => {
    return coordinate.toFixed(6).replace(/\.0+$/, "");
};

export const getMapViewportFromSearchParams = (
    searchParams: URLSearchParams
): MapViewport | null => {
    const longitudeParam = searchParams.get("x");
    const latitudeParam = searchParams.get("y");
    const zoomParam = searchParams.get("z");

    if (longitudeParam === null || latitudeParam === null || zoomParam === null) {
        return null;
    }

    const longitude = Number(longitudeParam);
    const latitude = Number(latitudeParam);
    const zoom = Number(zoomParam);

    if (
        !isInRange(longitude, -180, 180) ||
        !isInRange(latitude, -90, 90) ||
        !isInRange(zoom, DEFAULT_MAP_CONFIG.minZoom, DEFAULT_MAP_CONFIG.maxZoom)
    ) {
        return null;
    }

    return { center: [latitude, longitude], zoom };
};

export const withMapViewportSearchParams = (
    searchParams: URLSearchParams,
    { center, zoom }: MapViewport
) => {
    const nextSearchParams = new URLSearchParams(searchParams);

    nextSearchParams.set("x", formatCoordinate(center[1]));
    nextSearchParams.set("y", formatCoordinate(center[0]));
    nextSearchParams.set("z", String(zoom));

    return nextSearchParams;
};
