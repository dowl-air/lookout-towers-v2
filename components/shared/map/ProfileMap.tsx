"use client";

import { Check, Heart, Star } from "lucide-react";
import { useEffect, useMemo } from "react";

import { LeafletMap } from "@/components/shared/map/LeafletMap";
import { LeafletTileLayer } from "@/components/shared/map/LeafletTileLayer";
import { MapControls } from "@/components/shared/map/MapControls";
import { MapTileSwitcher } from "@/components/shared/map/MapTileSwitcher";
import { TowerMapDTO } from "@/data/tower/towers-map";
import { useLeafletMap } from "@/hooks/useLeafletMap";
import { useMapMarkers } from "@/hooks/useMapMarkers";
import { useMapTileProvider } from "@/hooks/useTileProvider";

/**
 * ProfileMap - Profile map component with theme-aware tile provider
 *
 * Optimizations:
 * - Memoized callbacks to prevent unnecessary re-renders
 * - Stable function references
 */
export function ProfileMap({ towers }: { towers: TowerMapDTO[] }) {
    // Use custom hook for theme-aware tile provider management
    const { tileProvider, currentProviderId, setProviderId } = useMapTileProvider();

    // User markers hook
    const { clearMarkers, addTowerMarkerWithPopup } = useMapMarkers();

    // Get Leaflet map instance for fitting bounds
    const map = useLeafletMap();

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
            addTowerMarkerWithPopup(tower, { showPersonalStatuses: true });
        }

        if (map) {
            map.fitBounds(towers.map((t) => [t.gps.latitude, t.gps.longitude]));
        }
    }, [towers, addTowerMarkerWithPopup, clearMarkers, map]);

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

            <div className="absolute left-4 top-4 z-1000 flex items-center gap-3 rounded-md border border-base-300/80 bg-base-100/95 px-3 py-2 text-xs font-medium text-base-content shadow-sm backdrop-blur-sm">
                <span className="inline-flex items-center gap-1">
                    <Check aria-hidden="true" className="size-3.5 text-success" />
                    Navštíveno
                </span>
                <span className="inline-flex items-center gap-1">
                    <Heart aria-hidden="true" className="size-3.5 text-amber-600" />
                    Oblíbené
                </span>
                <span className="inline-flex items-center gap-1">
                    <Star aria-hidden="true" className="size-3.5 text-purple-700" />
                    Hodnoceno
                </span>
            </div>

            <MapControls />
        </div>
    );
}
