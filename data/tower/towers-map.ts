import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { Tower } from "@/types/Tower";
import { CacheTag } from "@/utils/cacheTags";
import { db } from "@/utils/firebase-admin";
import { serializeFirestoreValue } from "@/utils/serializeFirestoreValue";

export type TowerMapDTO = Pick<
    Tower,
    | "id"
    | "openingHours"
    | "nameID"
    | "name"
    | "gps"
    | "type"
    | "mainPhotoUrl"
    | "opened"
    | "county"
    | "province"
    | "country"
> & { isVisited: boolean; isFavourite: boolean };

export const getAllTowersForMap = cache(async () => {
    "use cache";
    cacheLife("days");
    cacheTag(CacheTag.TowersMap);

    const snap = await db
        .collection("towers")
        .select(
            "id",
            "openingHours",
            "nameID",
            "name",
            "gps",
            "type",
            "mainPhotoUrl",
            "opened",
            "county",
            "province",
            "country"
        )
        .get();

    const towers: TowerMapDTO[] = [];
    snap.forEach((doc) => {
        towers.push(serializeFirestoreValue(doc.data()) as TowerMapDTO);
    });
    return towers;
});
