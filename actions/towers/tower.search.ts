"use server";

import { getTowerRatingAndCount } from "@/data/tower/towers";
import { Tower } from "@/types/Tower";
import { normalizeTypesenseTowerObject } from "@/utils/normalizeTowerObject";
import { typesenseClient } from "@/utils/typesense";

const DEFAULT_QUERY_BY = "name,aliases";
const FALLBACK_QUERY_BY = "name";

export const searchTowers = async ({
    q,
    query_by = DEFAULT_QUERY_BY,
    limit = 5,
    offset = 0,
    sort_by = "name:asc",
    include_ratings = false,
    filter_by = "",
}: {
    q: string;
    query_by?: string;
    limit?: number;
    offset?: number;
    sort_by?: string;
    filter_by?: string;
    include_ratings?: boolean;
}): Promise<{
    towers: Tower[];
    found: number;
    ratings: { avg: number; count: number; id: string }[];
}> => {
    const searchParams = {
        q,
        query_by,
        limit,
        offset,
        sort_by,
        filter_by,
    };

    let res;

    try {
        res = await typesenseClient.collections("towers").documents().search(searchParams);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const canFallbackToNameOnly = query_by === DEFAULT_QUERY_BY && message.includes("aliases");

        if (!canFallbackToNameOnly) {
            throw error;
        }

        res = await typesenseClient
            .collections("towers")
            .documents()
            .search({
                ...searchParams,
                query_by: FALLBACK_QUERY_BY,
            });
    }

    if (res.found === 0) return { found: res.found, towers: [], ratings: [] };
    if (!include_ratings)
        return {
            found: res.found,
            towers: res.hits.map((elm) => normalizeTypesenseTowerObject(elm.document)),
            ratings: [],
        };

    const ratings = await Promise.all(
        res.hits.map((elm) => getTowerRatingAndCount(elm.document.id))
    );

    return {
        found: res.found,
        towers: res.hits.map((elm) => normalizeTypesenseTowerObject(elm.document)),
        ratings: ratings.map((elm, index) => ({ ...elm, id: res.hits[index].document.id })),
    };
};
