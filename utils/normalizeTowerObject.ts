import { GPS, Tower, TowerFirebase } from "@/typings";

export const normalizeTowerObject = (tower: TowerFirebase): Tower => {
    const opened = tower.opened.toDate().toISOString();
    const modified = tower.modified.toDate().toISOString();
    const created = tower.created.toDate().toISOString();
    const gps: GPS = tower.gps.toJSON();
    return { ...tower, opened: opened, modified: modified, created: created, gps: gps } as Tower;
};
