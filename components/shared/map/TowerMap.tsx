"use client";

import { useEffect, useMemo } from "react";

import { LeafletMap } from "@/components/shared/map/LeafletMap";
import { LeafletTileLayer } from "@/components/shared/map/LeafletTileLayer";
import { useMapMarkers } from "@/hooks/useMapMarkers";
import { useMapTileProvider } from "@/hooks/useTileProvider";
import { Tower } from "@/types/Tower";

/**
 * TowerMap - Map component with theme-aware tile provider
 *
 * Optimizations:
 * - Memoized callbacks to prevent unnecessary re-renders
 * - Stable function references
 */
export function TowerMap({ tower }: { tower: Tower }) {
    // Use custom hook for theme-aware tile provider management
    const { tileProvider } = useMapTileProvider();

    // User markers hook
    const { clearMarkers, addMarker } = useMapMarkers();

    const tileLayerProps = useMemo(
        () => ({
            url: tileProvider.url,
            attribution: tileProvider.attribution,
            maxZoom: tileProvider.maxZoom,
        }),
        [tileProvider.url, tileProvider.attribution, tileProvider.maxZoom]
    );

    useEffect(() => {
        if (!tower) return;
        clearMarkers();
        const { latitude, longitude } = tower.gps;
        addMarker(latitude, longitude);
    }, [tower, addMarker, clearMarkers]);

    return (
        <div className="relative h-full w-full overflow-hidden">
            <LeafletMap
                className="w-full h-full"
                center={[tower.gps.latitude, tower.gps.longitude]}
                zoom={12}
            >
                <LeafletTileLayer
                    url={tileLayerProps.url}
                    attribution={tileLayerProps.attribution}
                    maxZoom={tileLayerProps.maxZoom}
                />
            </LeafletMap>
        </div>
    );
}
