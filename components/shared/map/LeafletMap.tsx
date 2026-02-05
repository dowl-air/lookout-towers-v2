"use client";

import type { Map as LeafletMapInstance, LeafletMouseEvent } from "leaflet";
import { useEffect, useRef, useContext, useCallback, ReactNode } from "react";

import { DEFAULT_MAP_CONFIG } from "@/constants/map-config";
import { MapContext } from "@/context/MapContext";

import "leaflet/dist/leaflet.css";

export interface LeafletMapProps {
    center?: [number, number];
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    className?: string;
    children?: ReactNode;
    onClick?: (lat: number, lng: number) => void;
    onMouseMove?: (lat: number, lng: number) => void;
    cursorStyle?: string;
}

/**
 * LeafletMap component - Core map wrapper that initializes Leaflet
 *
 * This component creates a map container and initializes a Leaflet map instance.
 * It registers the map with MapContext so other components can access it.
 *
 * Features:
 * - Initializes Leaflet map ONCE with configurable options
 * - Separates initialization from view updates to prevent unnecessary re-creation
 * - Registers map instance with MapContext
 * - Handles cleanup on unmount to prevent memory leaks
 * - Uses AbortController pattern for safe async cleanup
 * - Supports custom center, zoom, and zoom bounds
 *
 * @example
 * ```tsx
 * <MapProvider>
 *   <LeafletMap center={[51.505, -0.09]} zoom={13}>
 *     <LeafletTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
 *   </LeafletMap>
 * </MapProvider>
 * ```
 */
export function LeafletMap({
    center = DEFAULT_MAP_CONFIG.defaultCenter,
    zoom = DEFAULT_MAP_CONFIG.defaultZoom,
    minZoom = DEFAULT_MAP_CONFIG.minZoom,
    maxZoom = DEFAULT_MAP_CONFIG.maxZoom,
    className = "",
    children,
    onClick,
    onMouseMove,
    cursorStyle = "grab",
}: LeafletMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<LeafletMapInstance | null>(null);
    const isInitializedRef = useRef(false);

    // Store initial values to prevent re-initialization on prop changes
    const initialCenterRef = useRef(center);
    const initialZoomRef = useRef(zoom);

    const context = useContext(MapContext);

    if (context === undefined) {
        throw new Error("LeafletMap must be used within a MapProvider");
    }

    const { setMap } = context;

    // Memoized cleanup function
    const cleanupMap = useCallback(() => {
        if (mapRef.current) {
            try {
                mapRef.current.remove();
            } catch (error) {
                console.error("Error during map cleanup:", error);
            }
            mapRef.current = null;
            isInitializedRef.current = false;
            setMap(null);
        }
    }, [setMap]);

    // Initialize map ONCE on mount
    useEffect(() => {
        // Prevent double initialization (React StrictMode)
        if (isInitializedRef.current || !containerRef.current) {
            return;
        }

        let isMounted = true;
        const container = containerRef.current;

        const initializeMap = async () => {
            try {
                // Dynamically import Leaflet to avoid SSR issues
                const L = await import("leaflet");

                // Check if component is still mounted and not already initialized
                if (!isMounted || !container || isInitializedRef.current) {
                    return;
                }

                // Ensure container has dimensions before initializing
                const containerHeight = container.offsetHeight;
                if (containerHeight === 0) {
                    // Retry after a short delay if container isn't ready
                    await new Promise((resolve) => setTimeout(resolve, 50));
                    if (!isMounted || isInitializedRef.current) return;
                }

                // Initialize Leaflet map with initial values
                const map = L.map(container, {
                    center: initialCenterRef.current,
                    zoom: initialZoomRef.current,
                    minZoom,
                    maxZoom,
                    zoomControl: DEFAULT_MAP_CONFIG.zoomControl,
                    attributionControl: DEFAULT_MAP_CONFIG.attributionControl,
                });

                // Mark as initialized before storing reference
                isInitializedRef.current = true;
                mapRef.current = map;

                // Register map with context
                setMap(map);

                // Invalidate size after a brief delay to ensure proper tile rendering
                requestAnimationFrame(() => {
                    if (mapRef.current && isMounted) {
                        setTimeout(() => {
                            mapRef.current?.invalidateSize();
                        }, 100);
                    }
                });
            } catch (error) {
                if (isMounted) {
                    console.error("Failed to initialize Leaflet map:", error);
                }
            }
        };

        initializeMap();

        // Cleanup function
        return () => {
            isMounted = false;
            cleanupMap();
        };
    }, [minZoom, maxZoom, setMap, cleanupMap]);

    // Handle click events - separate effect to allow updates
    useEffect(() => {
        if (!mapRef.current || !onClick) return;

        const map = mapRef.current;
        const handleClick = (e: LeafletMouseEvent) => {
            onClick(e.latlng.lat, e.latlng.lng);
        };

        map.on("click", handleClick);

        return () => {
            map.off("click", handleClick);
        };
    }, [onClick]);

    // Handle mouse move events for cursor tracking
    useEffect(() => {
        if (!mapRef.current || !onMouseMove) return;

        const map = mapRef.current;
        const handleMouseMove = (e: LeafletMouseEvent) => {
            onMouseMove(e.latlng.lat, e.latlng.lng);
        };

        map.on("mousemove", handleMouseMove);

        return () => {
            map.off("mousemove", handleMouseMove);
        };
    }, [onMouseMove]);

    // Separate effect to handle view updates WITHOUT re-creating the map
    useEffect(() => {
        if (!mapRef.current) return;

        // Only update if values differ from current map state
        const currentCenter = mapRef.current.getCenter();
        const currentZoom = mapRef.current.getZoom();

        const centerChanged = currentCenter.lat !== center[0] || currentCenter.lng !== center[1];
        const zoomChanged = currentZoom !== zoom;

        if (centerChanged || zoomChanged) {
            mapRef.current.setView(center, zoom, { animate: true });
        }
    }, [center, zoom]);

    // Update cursor style when it changes
    useEffect(() => {
        if (!mapRef.current) return;
        const container = mapRef.current.getContainer();
        container.style.cursor = cursorStyle;
    }, [cursorStyle]);

    return (
        <>
            <div
                ref={containerRef}
                className={`w-full h-full ${className}`}
                data-testid="leaflet-map-container"
            />
            {children}
        </>
    );
}
