"use client";

import type { Marker } from "leaflet";
import { useCallback, useRef, useEffect } from "react";

import {
    getDefaultIcon,
    getFavouriteIcon,
    getNearbyIcon,
    getVisitedIcon,
} from "@/components/shared/map/icons";
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

type MarkerIconVariant = "default" | "favourite" | "nearby" | "visited";

type MarkerOptions = {
    iconVariant?: MarkerIconVariant;
    label?: string;
    labelClassName?: string;
    opacity?: number;
};

type PopupRoot = import("react-dom/client").Root;

const schedulePopupRootUnmount = (root: PopupRoot) => {
    setTimeout(() => {
        root.unmount();
    }, 0);
};

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
    const popupRootsRef = useRef<Map<string, PopupRoot>>(new Map());
    const openPopupIdsRef = useRef<Set<string>>(new Set());
    const leafletRef = useRef<typeof import("leaflet") | null>(null);

    const loadLeaflet = useCallback(async () => {
        if (!leafletRef.current) {
            leafletRef.current = await import("leaflet");
        }
        return leafletRef.current;
    }, []);

    const getMarkerIcon = useCallback((L: typeof import("leaflet"), variant: MarkerIconVariant) => {
        switch (variant) {
            case "visited":
                return getVisitedIcon(L);
            case "favourite":
                return getFavouriteIcon(L);
            case "nearby":
                return getNearbyIcon(L);
            case "default":
            default:
                return getDefaultIcon(L);
        }
    }, []);

    const bindPermanentLabel = useCallback(
        (
            L: typeof import("leaflet"),
            leafletMarker: Marker,
            label: string,
            labelClassName = "tower-map-label"
        ) => {
            leafletMarker.bindTooltip(label, {
                className: labelClassName,
                direction: "right",
                offset: L.point(14, -18),
                permanent: true,
            });
        },
        []
    );

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
        async (lat: number, lng: number, options: MarkerOptions = {}) => {
            if (!map) return null;

            const id = generateId();
            const L = await loadLeaflet();
            const iconVariant = options.iconVariant || "default";

            // Create Leaflet marker
            const leafletMarker = L.marker([lat, lng], {
                icon: getMarkerIcon(L, iconVariant),
                opacity: options.opacity ?? 1,
            }).addTo(map);

            if (options.label) {
                bindPermanentLabel(L, leafletMarker, options.label, options.labelClassName);
            }

            // Store reference
            leafletMarkersRef.current.set(id, leafletMarker);

            return id;
        },
        [bindPermanentLabel, generateId, getMarkerIcon, loadLeaflet, map]
    );

    const addTowerMarkerWithPopup = useCallback(
        async (
            tower: TowerMapDTO,
            options: {
                iconVariant?: MarkerIconVariant;
                label?: string;
                labelClassName?: string;
                showPermanentLabel?: boolean;
            } = {}
        ) => {
            if (!map) return null;

            const id = generateId();
            const L = await loadLeaflet();

            // Determine icon based on tower status
            const getIconVariant = (): MarkerIconVariant => {
                if (options.iconVariant) return options.iconVariant;
                if (tower.isVisited) return "visited";
                if (tower.isFavourite) return "favourite";
                return "default";
            };

            const getOpacity = () => {
                return tower.openingHours.type === OpeningHoursType.Forbidden ||
                    tower.openingHours.type === OpeningHoursType.Occasionally
                    ? 0.5
                    : 1;
            };
            // Create Leaflet marker
            const leafletMarker = L.marker([tower.gps.latitude, tower.gps.longitude], {
                icon: getMarkerIcon(L, getIconVariant()),
                opacity: getOpacity(),
            }).addTo(map);

            if (options.showPermanentLabel) {
                bindPermanentLabel(
                    L,
                    leafletMarker,
                    options.label || tower.name,
                    options.labelClassName
                );
            }

            const popupDiv = document.createElement("div");
            const popup = L.popup({
                className: "tower-card-popup",
                offset: L.point(0, -18),
            }).setContent(popupDiv);
            leafletMarker.bindPopup(popup);

            leafletMarker.on("popupopen", async () => {
                if (popupRootsRef.current.has(id)) {
                    return;
                }

                openPopupIdsRef.current.add(id);

                const root = (await import("react-dom/client")).createRoot(popupDiv);

                if (!openPopupIdsRef.current.has(id)) {
                    schedulePopupRootUnmount(root);
                    return;
                }

                root.render(<MapTowerCard tower={tower} />);
                popupRootsRef.current.set(id, root);

                // The popup opens before React mounts the card, so Leaflet computes
                // the anchor from an empty box. Re-run popup layout after mount.
                requestAnimationFrame(() => {
                    if (!openPopupIdsRef.current.has(id)) {
                        return;
                    }

                    popup.update();

                    requestAnimationFrame(() => {
                        if (!openPopupIdsRef.current.has(id)) {
                            return;
                        }

                        popup.update();
                    });
                });
            });

            leafletMarker.on("popupclose", () => {
                openPopupIdsRef.current.delete(id);

                const root = popupRootsRef.current.get(id);

                if (root) {
                    popupRootsRef.current.delete(id);
                    schedulePopupRootUnmount(root);
                }
            });

            // Store reference
            leafletMarkersRef.current.set(id, leafletMarker);

            return id;
        },
        [bindPermanentLabel, generateId, getMarkerIcon, loadLeaflet, map]
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

            const root = popupRootsRef.current.get(id);

            openPopupIdsRef.current.delete(id);

            if (root) {
                popupRootsRef.current.delete(id);
                schedulePopupRootUnmount(root);
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

        openPopupIdsRef.current.clear();
        popupRootsRef.current.forEach(schedulePopupRootUnmount);
        popupRootsRef.current.clear();
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
            openPopupIdsRef.current.clear();
            popupRootsRef.current.forEach(schedulePopupRootUnmount);
            popupRootsRef.current.clear();
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
