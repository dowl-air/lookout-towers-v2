import type { ScrapedTower, Tower } from "@/types/Tower";

export function mapScrapedTowerToForm(scrapedTower: ScrapedTower): Partial<Tower> {
    const tower = { ...scrapedTower };

    delete tower.created;
    delete tower.id;
    delete tower.modified;
    delete tower.nameID;
    delete tower.photos;
    delete tower.status;

    return tower;
}
