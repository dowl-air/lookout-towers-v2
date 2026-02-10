import "server-only";

import { cacheLife } from "next/cache";
import { cache } from "react";

import { db } from "@/utils/firebase-admin";
import { normalizeTowerObject } from "@/utils/normalizeTowerObject";

export const getTowerOfTheDay = cache(async () => {
    "use cache";
    cacheLife("hours");

    const today = new Date();
    const seedValue = parseInt(
        `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, "0")}${today
            .getDate()
            .toString()
            .padStart(2, "0")}`
    );
    const seededRandom = (seed: number) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    };
    const generatedRandom = seededRandom(seedValue);

    const snap = await db
        .collection("towers")
        .orderBy("random")
        .where("random", ">=", generatedRandom)
        .limit(1)
        .get();

    const doc = snap.docs[0];

    return { tower: normalizeTowerObject(doc.data()), date: today.toISOString() };
});
