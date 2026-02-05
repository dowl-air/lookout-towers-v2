import { MapConfig } from "@/types/Map";

/**
 * Default map configuration
 * Center: Czech Republic coordinates
 */
export const DEFAULT_MAP_CONFIG: MapConfig = {
    defaultCenter: [49.8237572, 15.474263],
    defaultZoom: 8,
    minZoom: 3,
    maxZoom: 18,
    zoomControl: false, // Using custom controls in dock
    attributionControl: true,
};
