import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { Tower } from "@/types/Tower";
import { CacheTag } from "@/utils/cacheTags";
import { normalizeTypesenseTowerObject } from "@/utils/normalizeTowerObject";
import { typesenseClient } from "@/utils/typesense";

const NEAREST_TOWERS_LIMIT = 5;
const NEAREST_TOWERS_QUERY_LIMIT = NEAREST_TOWERS_LIMIT + 1;

export const getNearestTowers = cache(
    async (towerID: string, latitude: number, longitude: number): Promise<Tower[]> => {
        "use cache";
        cacheLife("days");
        cacheTag(CacheTag.Towers);

        const result = await typesenseClient.collections("towers").documents().search({
            q: "*",
            query_by: "name",
            limit: NEAREST_TOWERS_QUERY_LIMIT,
            sort_by: `gps(${latitude}, ${longitude}):asc`,
        });

        return (result.hits || [])
            .map((hit) => normalizeTypesenseTowerObject(hit.document))
            .filter((tower) => tower.id !== towerID)
            .slice(0, NEAREST_TOWERS_LIMIT);
    }
);
