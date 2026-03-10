import "server-only";

import { Timestamp } from "firebase-admin/firestore";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { Change } from "@/types/Change";
import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";
import { db } from "@/utils/firebase-admin";

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

const serializeFirestoreValue = (value: unknown): unknown => {
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

const normalizeChange = (changeId: string, data: any): Change => {
    const serialized = serializeFirestoreValue(data) as Record<string, unknown>;

    return {
        ...serialized,
        id: changeId,
        created:
            typeof serialized.created === "string"
                ? serialized.created
                : new Date(serialized.created as string).toISOString(),
    } as Change;
};

export const getChange = cache(async (changeID: string): Promise<Change> => {
    "use cache";
    cacheLife("hours");
    cacheTag(CacheTag.Change);
    cacheTag(getCacheTagSpecific(CacheTag.Change, changeID));

    const snap = await db.collection("changes").doc(changeID).get();
    if (!snap.exists) {
        throw new Error("Change not found.");
    }

    return normalizeChange(snap.id, snap.data());
});

export const getUnresolvedChanges = cache(async (): Promise<Change[]> => {
    "use cache";
    cacheLife("hours");
    cacheTag(CacheTag.UnresolvedChanges);

    const snap = await db
        .collection("changes")
        .where("state", "==", "new")
        .orderBy("created", "desc")
        .get();

    return snap.docs.map((doc) => normalizeChange(doc.id, doc.data()));
});

export const getChangesByTower = cache(
    async (towerID: string, startAfter: string, limit: number): Promise<Change[]> => {
        "use cache";
        cacheLife("hours");
        cacheTag(CacheTag.ChangesTower);
        cacheTag(getCacheTagSpecific(CacheTag.ChangesTower, towerID));

        let query = db
            .collection("changes")
            .where("tower_id", "==", towerID)
            .orderBy("created", "desc")
            .limit(limit);

        if (startAfter) {
            const docSnap = await db.collection("changes").doc(startAfter).get();
            if (docSnap.exists) {
                query = query.startAfter(docSnap);
            }
        }

        const snap = await query.get();
        return snap.docs.map((doc) => normalizeChange(doc.id, doc.data()));
    }
);

export const getChangesByUser = cache(
    async (userID: string, startAfter: string, limit: number): Promise<Change[]> => {
        "use cache";
        cacheLife("hours");
        cacheTag(CacheTag.ChangesUser);
        cacheTag(getCacheTagSpecific(CacheTag.ChangesUser, userID));

        let query = db
            .collection("changes")
            .where("user_id", "==", userID)
            .orderBy("created", "desc")
            .limit(limit);

        if (startAfter) {
            const docSnap = await db.collection("changes").doc(startAfter).get();
            if (docSnap.exists) {
                query = query.startAfter(docSnap);
            }
        }

        const snap = await query.get();
        return snap.docs.map((doc) => normalizeChange(doc.id, doc.data()));
    }
);
