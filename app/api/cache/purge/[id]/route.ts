import { revalidateTag } from "next/cache";

import { getTowerByID, getTowerObjectByNameID } from "@/actions/towers/towers.action";
import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const tower_id = (await params).id;

    if (!tower_id)
        return new Response(JSON.stringify({ error: "Missing tower ID" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    let tower = await getTowerByID(tower_id);
    if (!tower) {
        tower = await getTowerObjectByNameID(tower_id);
        if (!tower)
            return new Response(JSON.stringify({ error: "Tower not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
    }

    revalidateTag(CacheTag.Towers, { expire: 0 });
    revalidateTag(CacheTag.TowersCount, { expire: 0 });
    revalidateTag(CacheTag.LastChangeDate, { expire: 0 });
    revalidateTag(getCacheTagSpecific(CacheTag.Tower, tower.id), { expire: 0 });
    revalidateTag(getCacheTagSpecific(CacheTag.Tower, tower.nameID), { expire: 0 });
    revalidateTag(getCacheTagSpecific(CacheTag.TowerGallery, tower.id), { expire: 0 });
    revalidateTag(getCacheTagSpecific(CacheTag.TowerRatingAndCount, tower.id), { expire: 0 });
    revalidateTag(getCacheTagSpecific(CacheTag.TowerVisitsCount, tower.id), { expire: 0 });
    revalidateTag(getCacheTagSpecific(CacheTag.TowerPhotos, tower.id), { expire: 0 });

    return new Response(JSON.stringify({ result: tower.id }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
    });
}
