"use server";

import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { updateTag } from "next/cache";

import { checkAuth } from "@/actions/checkAuth";
import { Rating } from "@/types/Rating";
import { CacheTag, getCacheTagSpecific, getCacheTagUserSpecific } from "@/utils/cacheTags";
import { db } from "@/utils/firebase";

export const editRating = async (towerID: string, rating: number, text: string) => {
    const user = await checkAuth();
    const ratingObj: Omit<Rating, "created" | "id"> = {
        rating,
        text,
        tower_id: towerID,
        user_id: user.id,
    };
    await setDoc(doc(db, "ratings", `${user.id}_${towerID}`), {
        ...ratingObj,
        created: serverTimestamp(),
    });

    updateTag(CacheTag.RatingsCount);
    updateTag(getCacheTagSpecific(CacheTag.TowerRatingAndCount, towerID));
    updateTag(getCacheTagSpecific(CacheTag.TowerRatings, towerID));
    updateTag(getCacheTagSpecific(CacheTag.UserRatings, user.id));
    updateTag(getCacheTagUserSpecific(CacheTag.UserTowerRating, user.id, towerID));
};

export const removeRating = async (towerID: string) => {
    const user = await checkAuth();
    await deleteDoc(doc(db, "ratings", `${user.id}_${towerID}`));

    updateTag(CacheTag.RatingsCount);
    updateTag(getCacheTagSpecific(CacheTag.TowerRatingAndCount, towerID));
    updateTag(getCacheTagSpecific(CacheTag.TowerRatings, towerID));
    updateTag(getCacheTagSpecific(CacheTag.UserRatings, user.id));
    updateTag(getCacheTagUserSpecific(CacheTag.UserTowerRating, user.id, towerID));
};
