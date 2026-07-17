import { Tower } from "@/types/Tower";
import { normalizeOpeningHours } from "@/utils/openingHours";
import { serializeFirestoreValue } from "@/utils/serializeFirestoreValue";

const normalizeTowerGps = (gps: unknown) => {
    if (!gps || typeof gps !== "object") {
        return gps;
    }

    if ("latitude" in gps && "longitude" in gps) {
        return {
            latitude: gps.latitude,
            longitude: gps.longitude,
        };
    }

    if ("lat" in gps && "lng" in gps) {
        return {
            latitude: gps.lat,
            longitude: gps.lng,
        };
    }

    return gps;
};

export const normalizeTowerObject = (tower: any): Tower => {
    const serialized = serializeFirestoreValue(tower) as Tower;

    return {
        ...serialized,
        gps: normalizeTowerGps(serialized.gps),
        openingHours: normalizeOpeningHours(serialized.openingHours),
    } as Tower;
};

export const normalizeTypesenseTowerObject = (tower: any): Tower => {
    const opened = tower.opened ? new Date(tower.opened * 1000).toISOString() : undefined;
    const modified = new Date(tower.modified * 1000).toISOString();
    const created = new Date(tower.created * 1000).toISOString();
    const gps: { latitude: number; longitude: number } = {
        latitude: tower.gps[0],
        longitude: tower.gps[1],
    };
    return {
        ...tower,
        ...(opened ? { opened } : {}),
        modified,
        created,
        gps,
        openingHours: normalizeOpeningHours(tower.openingHours),
    } as Tower;
};
