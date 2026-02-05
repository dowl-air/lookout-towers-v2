"use client";

import type { Map as LeafletMap } from "leaflet";
import { useContext } from "react";

import { MapContext } from "@/context/MapContext";

/**
 * Hook to access Leaflet map instance from MapContext
 *
 * @returns Leaflet map instance or null if not initialized
 * @throws Error if used outside MapProvider
 *
 * @example
 * ```tsx
 * function MapControl() {
 *   const map = useLeafletMap();
 *
 *   const handleZoomIn = () => {
 *     if (map) {
 *       map.zoomIn();
 *     }
 *   };
 *
 *   return (
 *     <button onClick={handleZoomIn} disabled={!map}>
 *       Zoom In
 *     </button>
 *   );
 * }
 * ```
 */
export function useLeafletMap(): LeafletMap | null {
    const context = useContext(MapContext);

    if (context === undefined) {
        throw new Error("useLeafletMap must be used within a MapProvider");
    }

    return context.map;
}
