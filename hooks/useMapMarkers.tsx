"use client";

import type { Marker } from "leaflet";
import { useCallback, useRef, useEffect } from "react";

import { getDefaultIcon, getFavouriteIcon, getVisitedIcon } from "@/components/shared/map/icons";
import MapTowerCard from "@/components/shared/map/MapTowerCard";
import { TowerMapDTO } from "@/data/tower/towers-map";
import { useLeafletMap } from "@/hooks/useLeafletMap";
import { OpeningHoursType } from "@/types/OpeningHours";

export interface MapMarker {
    id: string;
    lat: number;
    lng: number;
    label?: string;
}

/**
 * Hook for managing user-added markers on the map
 *
 * Features:
 * - Add/remove markers programmatically
 * - Proper cleanup on unmount
 * - Unique ID generation for each marker
 * - Optional popup labels
 *
 * @returns Object with marker management functions and state
 */
export function useMapMarkers() {
    const map = useLeafletMap();
    const leafletMarkersRef = useRef<Map<string, Marker>>(new Map());
    const leafletRef = useRef<typeof import("leaflet") | null>(null);

    const loadLeaflet = useCallback(async () => {
        if (!leafletRef.current) {
            leafletRef.current = await import("leaflet");
        }
        return leafletRef.current;
    }, []);

    /**
     * Generate unique marker ID
     */
    const generateId = useCallback(() => {
        return `marker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }, []);

    /**
     * Add a marker at the specified location
     */
    const addMarker = useCallback(
        async (lat: number, lng: number) => {
            if (!map) return null;

            const id = generateId();
            const L = await loadLeaflet();

            // Create Leaflet marker
            const leafletMarker = L.marker([lat, lng], {
                icon: getDefaultIcon(L),
            }).addTo(map);

            // Store reference
            leafletMarkersRef.current.set(id, leafletMarker);

            return id;
        },
        [map, generateId]
    );

    const addTowerMarkerWithPopup = useCallback(
        async (tower: TowerMapDTO) => {
            if (!map) return null;

            const id = generateId();
            const L = await loadLeaflet();

            // Determine icon based on tower status
            const getIcon = () => {
                if (tower.isVisited) return getVisitedIcon(L);
                if (tower.isFavourite) return getFavouriteIcon(L);
                return getDefaultIcon(L);
            };

            const getOpacity = () => {
                return tower.openingHours.type === OpeningHoursType.Forbidden ||
                    tower.openingHours.type === OpeningHoursType.Occasionally
                    ? 0.5
                    : 1;
            };
            // Create Leaflet marker
            const leafletMarker = L.marker([tower.gps.latitude, tower.gps.longitude], {
                icon: getIcon(),
                opacity: getOpacity(),
            }).addTo(map);

            // Add popup with <MapTowerCard />
            const popupDiv = document.createElement("div");
            const root = (await import("react-dom/client")).createRoot(popupDiv);
            root.render(<MapTowerCard tower={tower} />);

            const popup = L.popup().setContent(popupDiv);
            leafletMarker.bindPopup(popup);

            // Store reference
            leafletMarkersRef.current.set(id, leafletMarker);

            return id;
        },
        [map, generateId]
    );

    /**
     * Remove a marker by ID
     */
    const removeMarker = useCallback(
        (id: string) => {
            const leafletMarker = leafletMarkersRef.current.get(id);

            if (leafletMarker && map?.hasLayer(leafletMarker)) {
                map.removeLayer(leafletMarker);
            }

            leafletMarkersRef.current.delete(id);
        },
        [map]
    );

    /**
     * Remove all markers
     */
    const clearMarkers = useCallback(() => {
        leafletMarkersRef.current.forEach((leafletMarker) => {
            if (map?.hasLayer(leafletMarker)) {
                map.removeLayer(leafletMarker);
            }
        });

        leafletMarkersRef.current.clear();
    }, [map]);

    /**
     * Get marker by ID
     */
    const getMarker = useCallback((id: string): MapMarker | undefined => {
        const leafletMarker = leafletMarkersRef.current.get(id);
        if (!leafletMarker) return undefined;

        const { lat, lng } = leafletMarker.getLatLng();
        const label = leafletMarker.getPopup()?.getContent() as string | undefined;

        return { id, lat, lng, label };
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        // Copy ref value to local variable for cleanup
        const markersMap = leafletMarkersRef.current;

        return () => {
            markersMap.forEach((leafletMarker) => {
                if (map?.hasLayer(leafletMarker)) {
                    map.removeLayer(leafletMarker);
                }
            });
            markersMap.clear();
        };
    }, [map]);

    return {
        addMarker,
        addTowerMarkerWithPopup,
        removeMarker,
        clearMarkers,
        getMarker,
    };
}
