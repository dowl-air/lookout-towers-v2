"use client";

import { useEffect, useMemo, useState } from "react";

import { LeafletMap } from "@/components/shared/map/LeafletMap";
import { LeafletTileLayer } from "@/components/shared/map/LeafletTileLayer";
import { MapControls } from "@/components/shared/map/MapControls";
import { MapIntroduction } from "@/components/shared/map/MapIntroduction";
import { MapTileSwitcher } from "@/components/shared/map/MapTileSwitcher";
import { DEFAULT_MAP_CONFIG } from "@/constants/map-config";
import { TowerMapDTO } from "@/data/tower/towers-map";
import { useLeafletMap } from "@/hooks/useLeafletMap";
import { useMapMarkers } from "@/hooks/useMapMarkers";
import { useMapTileProvider } from "@/hooks/useTileProvider";
import { filterMapTowers, toggleExclusiveMapUserFilter } from "@/utils/mapTowerFilters";
import { type MapViewport, withMapViewportSearchParams } from "@/utils/mapViewportUrl";

/**
 * MapMain - Main map component with theme-aware tile provider
 *
 * Optimizations:
 * - Memoized callbacks to prevent unnecessary re-renders
 * - Stable function references
 */
export function MapMain({
    initialViewport,
    isAuthenticated,
    towers,
}: {
    initialViewport: MapViewport | null;
    isAuthenticated: boolean;
    towers: TowerMapDTO[];
}) {
    // Use custom hook for theme-aware tile provider management
    const { tileProvider, currentProviderId, setProviderId } = useMapTileProvider();
    const [onlyVisited, setOnlyVisited] = useState(false);
    const [onlyFavourites, setOnlyFavourites] = useState(false);
    const [includeGone, setIncludeGone] = useState(false);
    const map = useLeafletMap();

    const updateOnlyVisited = (checked: boolean) => {
        const filters = toggleExclusiveMapUserFilter(
            { onlyFavourites, onlyVisited },
            "onlyVisited",
            checked
        );

        setOnlyFavourites(filters.onlyFavourites);
        setOnlyVisited(filters.onlyVisited);
    };

    const updateOnlyFavourites = (checked: boolean) => {
        const filters = toggleExclusiveMapUserFilter(
            { onlyFavourites, onlyVisited },
            "onlyFavourites",
            checked
        );

        setOnlyFavourites(filters.onlyFavourites);
        setOnlyVisited(filters.onlyVisited);
    };

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
    const visibleTowers = useMemo(
        () =>
            filterMapTowers(towers, {
                includeGone,
                onlyFavourites,
                onlyVisited,
            }),
        [includeGone, onlyFavourites, onlyVisited, towers]
    );

    useEffect(() => {
        clearMarkers();

        for (const tower of visibleTowers) {
            addTowerMarkerWithPopup(tower);
        }
    }, [visibleTowers, addTowerMarkerWithPopup, clearMarkers]);

    useEffect(() => {
        if (!map) {
            return;
        }

        const syncViewportToUrl = () => {
            const center = map.getCenter();
            const searchParams = withMapViewportSearchParams(
                new URLSearchParams(window.location.search),
                { center: [center.lat, center.lng], zoom: map.getZoom() }
            );
            const search = searchParams.toString();

            window.history.replaceState(
                null,
                "",
                `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`
            );
        };

        map.on("moveend", syncViewportToUrl);

        return () => {
            map.off("moveend", syncViewportToUrl);
        };
    }, [map]);

    return (
        <div className="relative h-full w-full overflow-hidden">
            <LeafletMap
                center={initialViewport?.center ?? DEFAULT_MAP_CONFIG.defaultCenter}
                className="w-full h-full"
                zoom={initialViewport?.zoom ?? DEFAULT_MAP_CONFIG.defaultZoom}
            >
                <LeafletTileLayer
                    url={tileLayerProps.url}
                    attribution={tileLayerProps.attribution}
                    maxZoom={tileLayerProps.maxZoom}
                />
            </LeafletMap>

            <MapIntroduction
                includeGone={includeGone}
                isAuthenticated={isAuthenticated}
                onlyFavourites={onlyFavourites}
                onlyVisited={onlyVisited}
                onIncludeGoneChange={setIncludeGone}
                onOnlyFavouritesChange={updateOnlyFavourites}
                onOnlyVisitedChange={updateOnlyVisited}
            />

            <MapTileSwitcher
                selectedProviderId={currentProviderId}
                onProviderChange={setProviderId}
            />

            <MapControls />
        </div>
    );
}
