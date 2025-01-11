"use server";

import { getTowerRatingAndCount } from "@/actions/towers/towers.action";
import { Tower } from "@/typings";
import { normalizeTypesenseTowerObject } from "@/utils/normalizeTowerObject";

const Typesense = require("typesense");

const client = new Typesense.Client({
    nodes: [
        {
            host: process.env.TYPESENSE_HOST,
            port: 443,
            protocol: "https",
        },
    ],
    apiKey: process.env.TYPESENSE_KEY,
    connectionTimeoutSeconds: 2,
});

export const searchTowers = async ({
    q,
    query_by = "name",
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
}): Promise<{ towers: Tower[]; found: number; ratings: { avg: number; count: number; id: string }[] }> => {
    const res = await client.collections("towers").documents().search({
        q,
        query_by,
        limit,
        offset,
        sort_by,
        filter_by,
    });

    if (res.found === 0) return { found: res.found, towers: [], ratings: [] };
    if (!include_ratings) return { found: res.found, towers: res.hits.map((elm) => normalizeTypesenseTowerObject(elm.document)), ratings: [] };

    const ratings = await Promise.all(res.hits.map((elm) => getTowerRatingAndCount(elm.document.id)));

    return {
        found: res.found,
        towers: res.hits.map((elm) => normalizeTypesenseTowerObject(elm.document)),
        ratings: ratings.map((elm, index) => ({ ...elm, id: res.hits[index].document.id })),
    };
};
