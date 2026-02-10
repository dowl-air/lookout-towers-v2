"use client";

import Image from "next/image";
import { useState } from "react";

import { TILE_PROVIDERS } from "@/constants/tile-providers";

interface MapTileSwitcherProps {
    selectedProviderId: string;
    onProviderChange: (providerId: string) => void;
}

/**
 * MapTileSwitcher - Tile layer switcher UI
 */
export function MapTileSwitcher({ selectedProviderId, onProviderChange }: MapTileSwitcherProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Map tile providers to display options with PNG previews
    const layerOptions = [
        {
            id: "osm",
            label: "Základní",
            image: "/map-basic.png",
            provider: TILE_PROVIDERS.find((p) => p.id === "osm"),
        },
        {
            id: "satellite",
            label: "Satelitní",
            image: "/map-satellite.png",
            provider: TILE_PROVIDERS.find((p) => p.id === "satellite"),
        },
        {
            id: "dark",
            label: "Tmavý",
            image: "/map-dark.png",
            provider: TILE_PROVIDERS.find((p) => p.id === "dark"),
        },
    ];

    const selectedLayer =
        layerOptions.find((layer) => layer.id === selectedProviderId) || layerOptions[0];

    const onLayerClick = (layerId: string) => {
        setIsHovered(false);

        const layer = layerOptions.find((l) => l.id === layerId);
        if (layer?.provider) {
            onProviderChange(layerId);
        }
    };

    return (
        <div
            className="absolute bottom-24 sm:bottom-8 left-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 z-1000"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Slide-out Panel - Above on mobile, Right on desktop */}
            <div
                className={`order-first sm:order-last flex items-center gap-2 transition-all duration-300 ease-out ${
                    isHovered
                        ? "opacity-100 translate-y-0 sm:translate-y-0 sm:translate-x-0"
                        : "opacity-0 translate-y-4 sm:translate-y-0 sm:-translate-x-4 pointer-events-none w-0 h-0"
                }`}
            >
                <div className="flex items-center gap-2 rounded-2xl shadow-xl p-1 border bg-slate-700">
                    {layerOptions.map((layer) => (
                        <button
                            key={layer.id}
                            onClick={() => onLayerClick(layer.id)}
                            disabled={!layer.provider}
                            className={`flex flex-col items-center gap-1.5 px-2 sm:px-3 py-2 rounded-xl transition-all cursor-pointer ${
                                selectedProviderId === layer.id
                                    ? "bg-slate-600 ring-2 ring-slate-400"
                                    : "hover:bg-slate-600"
                            } ${!layer.provider ? "opacity-50 cursor-not-allowed" : ""}`}
                            title={layer.label}
                        >
                            <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-lg overflow-hidden shadow-sm">
                                <Image
                                    src={layer.image}
                                    alt={`${layer.label} map preview`}
                                    fill
                                    sizes="(max-width: 640px) 40px, 48px"
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-[10px] sm:text-xs font-medium text-gray-100">
                                {layer.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Tile Button */}
            <div className="flex flex-col items-center gap-1">
                <button
                    className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all"
                    aria-label="Mapová vrstva"
                >
                    <div className="relative h-16 w-16 sm:h-18 sm:w-20">
                        <Image
                            src={selectedLayer.image}
                            alt={`${selectedLayer.label} map preview`}
                            fill
                            sizes="(max-width: 640px) 64px, 80px"
                            className="object-cover"
                        />
                    </div>
                    <span className="block px-2 py-1 text-[10px] sm:text-xs font-medium bg-slate-700 hover:bg-slate-600 text-gray-100">
                        {selectedLayer.label}
                    </span>
                </button>
            </div>
        </div>
    );
}
