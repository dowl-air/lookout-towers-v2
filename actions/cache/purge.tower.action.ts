"use server";

import { getTowerByID, getTowerObjectByNameID } from "@/actions/towers/towers.action";
import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";
import { revalidateTag } from "next/cache";

export const revalidateTower = async (formData: FormData) => {
    const tower_id = formData.get("tower_id") as string;
    if (!tower_id) return null;
    let tower = await getTowerByID(tower_id);
    if (!tower) {
        tower = await getTowerObjectByNameID(tower_id);
        if (!tower) return "Tower not found";
    }

    revalidateTag(CacheTag.Towers);
    revalidateTag(CacheTag.TowersCount);
    revalidateTag(CacheTag.LastChangeDate);
    revalidateTag(getCacheTagSpecific(CacheTag.Tower, tower.id));
    revalidateTag(getCacheTagSpecific(CacheTag.Tower, tower.nameID));
    revalidateTag(getCacheTagSpecific(CacheTag.TowerGallery, tower.id));
    revalidateTag(getCacheTagSpecific(CacheTag.TowerRatingAndCount, tower.id));
    revalidateTag(getCacheTagSpecific(CacheTag.TowerVisitsCount, tower.id));
    revalidateTag(getCacheTagSpecific(CacheTag.TowerPhotos, tower.id));

    return tower.id;
};
