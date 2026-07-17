import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { CountryCode } from "@/constants/countries";
import PROVINCES_CZ from "@/constants/provinces/CZ";
import { TowerTypeEnum } from "@/constants/towerType";
import { OpeningHours } from "@/types/OpeningHours";
import { CacheTag } from "@/utils/cacheTags";
import { db } from "@/utils/firebase-admin";
import { serializeFirestoreValue } from "@/utils/serializeFirestoreValue";

export type TowerCollectionDTO = {
    country: string | CountryCode;
    county?: string;
    id: string;
    name: string;
    nameID: string;
    opened?: string | Date;
    openingHours: OpeningHours;
    province?: string;
    type: TowerTypeEnum;
};

const CZECH_COUNTRY_VALUES = new Set([
    "CZ",
    "Czechia",
    "Czech Republic",
    "Česko",
    "Česká republika",
]);

const isCzechTower = (tower: TowerCollectionDTO): boolean => {
    if (CZECH_COUNTRY_VALUES.has(String(tower.country))) {
        return true;
    }

    return PROVINCES_CZ.some(
        (province) =>
            tower.province === province.code ||
            tower.province === province.name ||
            tower.province === province.shortName ||
            province.counties.includes(tower.county)
    );
};

export const getCzechTowersForProgress = cache(async (): Promise<TowerCollectionDTO[]> => {
    "use cache";
    cacheLife("days");
    cacheTag(CacheTag.Towers);

    const snap = await db
        .collection("towers")
        .select(
            "country",
            "county",
            "id",
            "name",
            "nameID",
            "opened",
            "openingHours",
            "province",
            "type"
        )
        .get();

    return snap.docs
        .map((doc) => serializeFirestoreValue(doc.data()) as TowerCollectionDTO)
        .filter(isCzechTower);
});
