import { GPS, Tower, TowerFirebase } from "@/typings";

export const normalizeTowerObject = (tower: TowerFirebase): Tower => {
    const opened: Date = tower.opened.toDate();
    const modified: Date = tower.opened.toDate();
    const created: Date = tower.opened.toDate();
    const gps: GPS = tower.gps.toJSON();
    return {...tower, opened: opened, modified: modified, created: created, gps: gps} as Tower
}