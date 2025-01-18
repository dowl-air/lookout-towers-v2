import { Tower } from "@/types/Tower";

export const normalizeTowerObject = (tower: any): Tower => {
    const opened = tower.opened.toDate().toISOString();
    const modified = tower.modified.toDate().toISOString();
    const created = tower.created.toDate().toISOString();
    const gps = tower.gps.toJSON();
    return { ...tower, opened: opened, modified: modified, created: created, gps: gps } as Tower;
};

export const normalizeTypesenseTowerObject = (tower: any): Tower => {
    const opened = new Date(tower.opened * 1000).toISOString();
    const modified = new Date(tower.modified * 1000).toISOString();
    const created = new Date(tower.created * 1000).toISOString();
    const gps: { latitude: number; longitude: number } = { latitude: tower.gps[0], longitude: tower.gps[1] };
    return { ...tower, opened, modified, created, gps } as Tower;
};
