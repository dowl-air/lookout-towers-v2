import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { User } from "@/types/User";
import { CacheTag } from "@/utils/cacheTags";
import { db } from "@/utils/firebase-admin";
import { normalizeTowerObject } from "@/utils/normalizeTowerObject";
import { serializeFirestoreValue } from "@/utils/serializeFirestoreValue";

const getVisitCount = async (userId: string) => {
    const snap = await db.collection("visits").where("user_id", "==", userId).count().get();
    return snap.data().count;
};

const getRatingCount = async (userId: string) => {
    const snap = await db.collection("ratings").where("user_id", "==", userId).count().get();
    return snap.data().count;
};

const getChangeCount = async (userId: string) => {
    const snap = await db.collection("changes").where("user_id", "==", userId).count().get();
    return snap.data().count;
};

const getLastVisit = async (userId: string) => {
    const snap = await db
        .collection("visits")
        .where("user_id", "==", userId)
        .orderBy("date", "desc")
        .limit(1)
        .get();

    if (snap.empty) {
        return { lastVisited: null };
    }

    const towerSnap = await db.collection("towers").doc(snap.docs[0].data().tower_id).get();
    const tower = normalizeTowerObject(towerSnap.data());

    const lastVisitData = snap.docs[0].data();
    return {
        lastVisited: {
            tower,
            date: serializeFirestoreValue(lastVisitData.date) as string,
        },
    };
};

export const getAllMembers: () => Promise<User[]> = cache(async () => {
    "use cache";
    cacheLife("hours");
    cacheTag(CacheTag.UsersCommunity);

    const usersSnap = await db.collection("users").get();

    return Promise.all(
        usersSnap.docs.map(async (doc) => {
            const userData = serializeFirestoreValue(doc.data()) as Record<string, unknown>;

            const [visits, ratings, changes, lastVisited] = await Promise.all([
                getVisitCount(doc.id),
                getRatingCount(doc.id),
                getChangeCount(doc.id),
                getLastVisit(doc.id),
            ]);

            return {
                id: doc.id,
                name: typeof userData.name === "string" ? userData.name : "Uživatel",
                email: typeof userData.email === "string" ? userData.email : "",
                image: typeof userData.image === "string" ? userData.image : undefined,
                visits,
                ratings,
                changes,
                ...lastVisited,
            } satisfies User;
        })
    );
});
