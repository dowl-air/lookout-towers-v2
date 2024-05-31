"use server";
import MeiliSearch from "meilisearch";

import { SearchResult } from "@/typings";

const client = new MeiliSearch({
    host: 'https://search.rozhlednovysvet.cz',
    apiKey: process.env.MEILI_KEY
})

export const searchTowers = async (queryString: string, limit: number = 5, offset: number = 0, filter: string = "") : Promise<SearchResult[]> => {
    const res = await client.index('towers').search(queryString, {
        limit: limit,
        offset: offset,
        filter: filter,
        sort: ["name:asc"]
    });
    return res.hits.map((elm) => {return {...elm, opened: new Date(elm.opened._seconds)}}) as SearchResult[]
}