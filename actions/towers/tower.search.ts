"use server";

import { getTowerRatingAndCount } from "@/actions/towers/towers.action";
import { Tower } from "@/typings";

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
    sort_by = "",
    include_ratings = false,
}: {
    q: string;
    query_by?: string;
    limit?: number;
    offset?: number;
    sort_by?: string;
    include_ratings?: boolean;
}): Promise<{ towers: Tower[]; ratings: { avg: number; count: number; id: string }[] }> => {
    const res = await client.collections("towers").documents().search({
        q,
        query_by,
        limit,
        offset,
        sort_by,
    });

    if (res.found === 0) return { towers: [], ratings: [] };
    if (!include_ratings) return { towers: res.hits.map((elm) => elm.document), ratings: [] };

    const ratings = await Promise.all(res.hits.map((elm) => getTowerRatingAndCount(elm.document.id)));

    return { towers: res.hits.map((elm) => elm.document), ratings: ratings.map((elm, index) => ({ ...elm, id: res.hits[index].document.id })) };
};
