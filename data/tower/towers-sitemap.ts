import { db } from "@/utils/firebase-admin";
import { serializeFirestoreValue } from "@/utils/serializeFirestoreValue";

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
        const serialized = serializeFirestoreValue(doc.data()) as Omit<
            TowerSitemapDTO,
            "modified"
        > & {
            modified: string | Date;
        };

        towers.push({
            ...serialized,
            modified: new Date(serialized.modified),
        });
    });

    return towers;
};
