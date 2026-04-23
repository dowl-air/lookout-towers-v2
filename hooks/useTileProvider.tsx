import { useTheme } from "next-themes";
import { useState, useMemo } from "react";

import { getDefaultTileProvider, getTileProviderById } from "@/constants/tile-providers";
import { TileProvider } from "@/types/Map";
import { normalizeTheme } from "@/utils/theme";

/**
 * Custom hook to manage map tile provider with theme-aware auto-switching
 *
 * Logic:
 * - When theme changes, automatically switch to matching basemap (dark theme → dark basemap)
 * - User can manually override by selecting a different basemap
 * - Manual selection persists until theme changes again
 *
 * @returns Object with current tile provider and setter function
 */
export function useMapTileProvider() {
    const { resolvedTheme } = useTheme();
    const [manualProviderId, setManualProviderId] = useState<string | null>(null);
    const normalizedTheme = normalizeTheme(resolvedTheme);

    // Determine which tile provider to use
    const tileProvider = useMemo<TileProvider>(() => {
        // If user manually selected a provider, use that
        if (manualProviderId) {
            return getTileProviderById(manualProviderId) || getDefaultTileProvider();
        }

        // Otherwise, auto-switch based on theme
        if (normalizedTheme === "abyss") {
            return getTileProviderById("dark") || getDefaultTileProvider();
        }

        return getDefaultTileProvider();
    }, [manualProviderId, normalizedTheme]);

    // Get the current provider ID for UI state
    const currentProviderId = manualProviderId || (normalizedTheme === "abyss" ? "dark" : "osm");

    // Handler that resets manual selection when theme changes
    const setProviderId = (id: string | null) => {
        setManualProviderId(id);
    };

    return {
        tileProvider,
        currentProviderId,
        setProviderId,
    };
}
