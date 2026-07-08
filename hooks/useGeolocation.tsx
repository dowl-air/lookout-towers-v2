"use client";

import type { Circle, Marker, LocationEvent, ErrorEvent } from "leaflet";
import { useState, useCallback, useRef, useEffect } from "react";

import { useLeafletMap } from "@/hooks/useLeafletMap";

/**
 * Custom hook for geolocation functionality
 *
 * Provides a reusable way to locate user's position on the map
 * and add a marker at their location.
 *
 * Features:
 * - Proper event handler cleanup
 * - Tracks location markers for cleanup
 * - Safe async Leaflet import pattern
 *
 * @returns Object with locate function and loading state
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { locateUser, isLocating } = useGeolocation();
 *
 *   return (
 *     <button onClick={locateUser} disabled={isLocating}>
 *       {isLocating ? 'Locating...' : 'Find Me'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useGeolocation() {
    const map = useLeafletMap();
    const [isLocating, setIsLocating] = useState(false);

    // Store references for cleanup
    const locationCircleRef = useRef<Circle | null>(null);
    const locationMarkerRef = useRef<Marker | null>(null);
    const locationFoundHandlerRef = useRef<((e: LocationEvent) => void) | null>(null);
    const locationErrorHandlerRef = useRef<((e: ErrorEvent) => void) | null>(null);
    const locationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearLocationTimeout = useCallback(() => {
        if (locationTimeoutRef.current) {
            clearTimeout(locationTimeoutRef.current);
            locationTimeoutRef.current = null;
        }
    }, []);

    // Cleanup function for location markers
    const clearLocationMarkers = useCallback(() => {
        if (locationCircleRef.current && map?.hasLayer(locationCircleRef.current)) {
            map.removeLayer(locationCircleRef.current);
            locationCircleRef.current = null;
        }
        if (locationMarkerRef.current && map?.hasLayer(locationMarkerRef.current)) {
            map.removeLayer(locationMarkerRef.current);
            locationMarkerRef.current = null;
        }
    }, [map]);

    // Cleanup event handlers
    const cleanupEventHandlers = useCallback(() => {
        if (!map) return;

        if (locationFoundHandlerRef.current) {
            map.off("locationfound", locationFoundHandlerRef.current);
            locationFoundHandlerRef.current = null;
        }
        if (locationErrorHandlerRef.current) {
            map.off("locationerror", locationErrorHandlerRef.current);
            locationErrorHandlerRef.current = null;
        }
    }, [map]);

    const finishLocating = useCallback(() => {
        setIsLocating(false);
        clearLocationTimeout();
        cleanupEventHandlers();
    }, [cleanupEventHandlers, clearLocationTimeout]);

    const locateUser = useCallback(() => {
        if (!map) {
            console.warn("Map instance not available");
            return;
        }

        // Clean up previous handlers and markers
        map.stopLocate();
        cleanupEventHandlers();
        clearLocationTimeout();
        clearLocationMarkers();

        setIsLocating(true);
        locationTimeoutRef.current = setTimeout(() => {
            map.stopLocate();
            finishLocating();
        }, 12000);

        // Create handlers with stored references
        const handleLocationFound = async (e: LocationEvent) => {
            finishLocating();

            try {
                // Dynamically import Leaflet to add markers
                const L = await import("leaflet");

                // Clear any existing markers first
                clearLocationMarkers();

                // Add accuracy circle
                const circle = L.circle(e.latlng, {
                    radius: e.accuracy / 2,
                    color: "#3b82f6",
                    fillColor: "#3b82f6",
                    fillOpacity: 0.2,
                }).addTo(map);
                locationCircleRef.current = circle;

                // Add location marker
                const marker = L.marker(e.latlng, {
                    icon: L.divIcon({
                        className: "custom-location-marker",
                        html: `<div style="width: 16px; height: 16px; background: #3b82f6; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                        iconSize: [16, 16],
                        iconAnchor: [8, 8],
                    }),
                }).addTo(map);
                locationMarkerRef.current = marker;
            } catch (error) {
                console.error("Failed to add location markers:", error);
            }
        };

        const handleLocationError = (e: ErrorEvent) => {
            finishLocating();
            console.error("Location error:", e.message);
        };

        // Store handler references
        locationFoundHandlerRef.current = handleLocationFound;
        locationErrorHandlerRef.current = handleLocationError;

        // Attach handlers
        map.once("locationfound", handleLocationFound);
        map.once("locationerror", handleLocationError);

        // Request user's location
        map.locate({ setView: true, maxZoom: 8, timeout: 10000 });
    }, [map, cleanupEventHandlers, clearLocationMarkers, clearLocationTimeout, finishLocating]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            map?.stopLocate();
            clearLocationTimeout();
            cleanupEventHandlers();
            clearLocationMarkers();
        };
    }, [map, cleanupEventHandlers, clearLocationMarkers, clearLocationTimeout]);

    return {
        locateUser,
        isLocating,
        isAvailable: !!map,
        clearLocationMarkers,
    };
}
