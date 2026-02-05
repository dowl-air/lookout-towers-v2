import { Timestamp } from "firebase-admin/firestore";

import { db } from "@/utils/firebase-admin";

type TowerSitemapDTO = {
    id: string;
    nameID: string;
    type: string;
    modified: Date;
};

export const getAllTowersForSitemap = async () => {
    const snap = await db.collection("towers").select("id", "nameID", "type", "modified").get();

    const towers: TowerSitemapDTO[] = [];
    snap.forEach((doc) => {
        const t = doc.data() as TowerSitemapDTO;
        t.modified = t.modified instanceof Timestamp ? t.modified.toDate() : t.modified;
        towers.push(t);
    });

    return towers;
};
