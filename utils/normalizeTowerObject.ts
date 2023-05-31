import { GPS, Tower, TowerFirebase } from "@/typings";

export const normalizeTowerObject = (tower: TowerFirebase): Tower => {
    const opened: Date = tower.opened.toDate();
    const modified: Date = tower.modified.toDate();
    const created: Date = tower.created.toDate();
    const gps: GPS = tower.gps.toJSON();
    return {...tower, opened: opened, modified: modified, created: created, gps: gps} as Tower
}