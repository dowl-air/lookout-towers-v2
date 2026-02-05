import "server-only";

import { GeoPoint, Timestamp } from "firebase-admin/firestore";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { Tower } from "@/types/Tower";
import { CacheTag } from "@/utils/cacheTags";
import { db } from "@/utils/firebase-admin";

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
        const t = doc.data() as TowerMapDTO;
        t.opened = t.opened instanceof Timestamp ? t.opened.toDate() : t.opened;
        t.gps =
            t.gps instanceof GeoPoint
                ? { latitude: t.gps.latitude, longitude: t.gps.longitude }
                : t.gps;
        towers.push(t);
    });
    return towers;
});
