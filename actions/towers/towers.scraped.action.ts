"use server";

import { updateTag } from "next/cache";

import { checkAuth } from "@/actions/checkAuth";
import { getReadyScrapedTowers } from "@/data/tower/towers-scraped";
import { CacheTag } from "@/utils/cacheTags";
import { db } from "@/utils/firebase-admin";

export const getReadyScrapedTowersAction = async () => {
    const user = await checkAuth();
    if (!user) throw new Error("Unauthorized");

    return getReadyScrapedTowers();
};

export const markScrapedTowerImported = async (scrapedTowerId: string, towerId: string) => {
    const user = await checkAuth();
    if (!user) throw new Error("Unauthorized");

    await db.collection("towers_scraped").doc(scrapedTowerId).update({
        importedAt: new Date().toISOString(),
        importedTowerId: towerId,
        modified: new Date().toISOString(),
        status: "imported",
    });
    updateTag(CacheTag.ScrapedTowers);
};
