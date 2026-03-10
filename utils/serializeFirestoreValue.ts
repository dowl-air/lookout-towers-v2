import { Timestamp } from "firebase-admin/firestore";

const isGeoPointLike = (value: unknown): value is { latitude: number; longitude: number } => {
    return (
        typeof value === "object" &&
        value !== null &&
        "latitude" in value &&
        "longitude" in value &&
        typeof value.latitude === "number" &&
        typeof value.longitude === "number"
    );
};

export const serializeFirestoreValue = (value: unknown): unknown => {
    if (value === null || value === undefined) {
        return value;
    }

    if (value instanceof Timestamp) {
        return value.toDate().toISOString();
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    if (Array.isArray(value)) {
        return value.map((item) => serializeFirestoreValue(item));
    }

    if (isGeoPointLike(value)) {
        return {
            latitude: value.latitude,
            longitude: value.longitude,
        };
    }

    if (typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value).map(([key, item]) => [key, serializeFirestoreValue(item)])
        );
    }

    return value;
};
