import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { OpeningHoursForbiddenType } from "@/types/OpeningHours";
import { Tower } from "@/types/Tower";
import { CacheTag } from "@/utils/cacheTags";
import { filterPermanentlyUnavailableTowers } from "@/utils/mapTowerFilters";
import { normalizeTypesenseTowerObject } from "@/utils/normalizeTowerObject";
import { typesenseClient } from "@/utils/typesense";

const NEAREST_TOWERS_LIMIT = 5;
const NEAREST_TOWERS_QUERY_LIMIT = NEAREST_TOWERS_LIMIT + 1;

export const getNearestTowers = cache(
    async (towerID: string, latitude: number, longitude: number): Promise<Tower[]> => {
        "use cache";
        cacheLife("days");
        cacheTag(CacheTag.Towers);

        const result = await typesenseClient
            .collections("towers")
            .documents()
            .search({
                q: "*",
                query_by: "name",
                limit: NEAREST_TOWERS_QUERY_LIMIT,
                sort_by: `gps(${latitude}, ${longitude}):asc`,
                filter_by: [
                    `openingHours.forbiddenType:!=${OpeningHoursForbiddenType.Gone}`,
                    `openingHours.forbiddenType:!=${OpeningHoursForbiddenType.Banned}`,
                ].join(" && "),
            });

        const towers = (result.hits || [])
            .map((hit) => normalizeTypesenseTowerObject(hit.document))
            .filter((tower) => tower.id !== towerID);

        return filterPermanentlyUnavailableTowers<Tower>(towers).slice(0, NEAREST_TOWERS_LIMIT);
    }
);
