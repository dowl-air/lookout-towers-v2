"use server";

import { updateTag } from "next/cache";

import { getTowerByID, getTowerObjectByNameID } from "@/actions/towers/towers.action";
import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";

export const revalidateTower = async (formData: FormData) => {
    const tower_id = formData.get("tower_id") as string;
    if (!tower_id) return null;
    let tower = await getTowerByID(tower_id);
    if (!tower) {
        tower = await getTowerObjectByNameID(tower_id);
        if (!tower) return "Tower not found";
    }

    updateTag(CacheTag.Towers);
    updateTag(CacheTag.TowersCount);
    updateTag(CacheTag.LastChangeDate);
    updateTag(getCacheTagSpecific(CacheTag.Tower, tower.id));
    updateTag(getCacheTagSpecific(CacheTag.Tower, tower.nameID));
    updateTag(getCacheTagSpecific(CacheTag.TowerGallery, tower.id));
    updateTag(getCacheTagSpecific(CacheTag.TowerRatingAndCount, tower.id));
    updateTag(getCacheTagSpecific(CacheTag.TowerVisitsCount, tower.id));
    updateTag(getCacheTagSpecific(CacheTag.TowerPhotos, tower.id));

    return tower.id;
};

export const revalidateTowerByIDOrNameID = async (tower_id: string) => {
    if (!tower_id) return null;
    let tower = await getTowerByID(tower_id);
    if (!tower) {
        tower = await getTowerObjectByNameID(tower_id);
        if (!tower) return "Tower not found";
    }

    updateTag(CacheTag.Towers);
    updateTag(CacheTag.TowersCount);
    updateTag(CacheTag.LastChangeDate);
    updateTag(getCacheTagSpecific(CacheTag.Tower, tower.id));
    updateTag(getCacheTagSpecific(CacheTag.Tower, tower.nameID));
    updateTag(getCacheTagSpecific(CacheTag.TowerGallery, tower.id));
    updateTag(getCacheTagSpecific(CacheTag.TowerRatingAndCount, tower.id));
    updateTag(getCacheTagSpecific(CacheTag.TowerVisitsCount, tower.id));
    updateTag(getCacheTagSpecific(CacheTag.TowerPhotos, tower.id));

    return tower.id;
};
