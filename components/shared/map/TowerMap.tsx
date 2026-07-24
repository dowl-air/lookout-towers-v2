"use client";

import { useEffect, useMemo } from "react";

import { LeafletMap } from "@/components/shared/map/LeafletMap";
import { LeafletTileLayer } from "@/components/shared/map/LeafletTileLayer";
import { useLeafletMap } from "@/hooks/useLeafletMap";
import { useMapMarkers } from "@/hooks/useMapMarkers";
import { useMapTileProvider } from "@/hooks/useTileProvider";
import { Tower } from "@/types/Tower";
import { isGoneTower } from "@/utils/mapTowerFilters";

/**
 * TowerMap - Map component with theme-aware tile provider
 *
 * Optimizations:
 * - Memoized callbacks to prevent unnecessary re-renders
 * - Stable function references
 */
export function TowerMap({ tower, nearbyTowers = [] }: { nearbyTowers?: Tower[]; tower: Tower }) {
    // Use custom hook for theme-aware tile provider management
    const { tileProvider } = useMapTileProvider();

    // User markers hook
    const { clearMarkers, addMarker } = useMapMarkers();
    const map = useLeafletMap();

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
        const points: [number, number][] = [[latitude, longitude]];

        void addMarker(latitude, longitude, {
            isGone: isGoneTower(tower),
            label: tower.name,
            labelClassName: "tower-map-label tower-map-label-primary",
            towerType: tower.type,
        });

        for (const nearbyTower of nearbyTowers) {
            points.push([nearbyTower.gps.latitude, nearbyTower.gps.longitude]);

            void addMarker(nearbyTower.gps.latitude, nearbyTower.gps.longitude, {
                isGone: isGoneTower(nearbyTower),
                label: nearbyTower.name,
                labelClassName: "tower-map-label",
                towerType: nearbyTower.type,
            });
        }

        if (!map) {
            return;
        }

        if (points.length > 1) {
            map.fitBounds(points, {
                padding: [48, 48],
            });
            return;
        }

        map.setView([latitude, longitude], 12, { animate: true });
    }, [addMarker, clearMarkers, map, nearbyTowers, tower]);

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
