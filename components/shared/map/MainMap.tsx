"use client";

import { useEffect, useMemo } from "react";

import { LeafletMap } from "@/components/shared/map/LeafletMap";
import { LeafletTileLayer } from "@/components/shared/map/LeafletTileLayer";
import { MapControls } from "@/components/shared/map/MapControls";
import { MapTileSwitcher } from "@/components/shared/map/MapTileSwitcher";
import { TowerMapDTO } from "@/data/tower/towers-map";
import { useMapMarkers } from "@/hooks/useMapMarkers";
import { useMapTileProvider } from "@/hooks/useTileProvider";

/**
 * MapMain - Main map component with theme-aware tile provider
 *
 * Optimizations:
 * - Memoized callbacks to prevent unnecessary re-renders
 * - Stable function references
 */
export function MapMain({ towers }: { towers: TowerMapDTO[] }) {
    // Use custom hook for theme-aware tile provider management
    const { tileProvider, currentProviderId, setProviderId } = useMapTileProvider();

    // User markers hook
    const { clearMarkers, addTowerMarkerWithPopup } = useMapMarkers();

    // Memoize tile layer props to prevent unnecessary updates
    const tileLayerProps = useMemo(
        () => ({
            url: tileProvider.url,
            attribution: tileProvider.attribution,
            maxZoom: tileProvider.maxZoom,
        }),
        [tileProvider.url, tileProvider.attribution, tileProvider.maxZoom]
    );

    useEffect(() => {
        if (!towers.length) return;

        clearMarkers();

        for (const tower of towers) {
            addTowerMarkerWithPopup(tower);
        }
    }, [towers, addTowerMarkerWithPopup, clearMarkers]);

    return (
        <div className="relative h-full w-full overflow-hidden">
            <LeafletMap className="w-full h-full">
                <LeafletTileLayer
                    url={tileLayerProps.url}
                    attribution={tileLayerProps.attribution}
                    maxZoom={tileLayerProps.maxZoom}
                />
            </LeafletMap>

            <MapTileSwitcher
                selectedProviderId={currentProviderId}
                onProviderChange={setProviderId}
            />

            <MapControls />
        </div>
    );
}
