"use server";

import { revalidatePath, updateTag } from "next/cache";

import { checkAdmin } from "@/actions/checkAdmin";
import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";
import { db, storageBucket } from "@/utils/firebase-admin";

const ADMIN_USER_ID = "iMKZNJV5PE4XQjnKmZut";
const MAX_NAME_LENGTH = 50;

export type AdminUserActionState = {
    error?: string;
    success?: boolean;
};

const revalidateUserData = (userId: string) => {
    updateTag(CacheTag.UsersCommunity);
    updateTag(CacheTag.UsersCount);
    updateTag(getCacheTagSpecific(CacheTag.User, userId));
    updateTag(getCacheTagSpecific(CacheTag.UserFavourites, userId));
    updateTag(getCacheTagSpecific(CacheTag.UserRatings, userId));
    updateTag(getCacheTagSpecific(CacheTag.UserVisits, userId));
    updateTag(getCacheTagSpecific(CacheTag.ChangesUser, userId));
};

const deleteDocumentsByUser = async (collectionName: string, userId: string) => {
    const snapshot = await db.collection(collectionName).where("user_id", "==", userId).get();

    for (let index = 0; index < snapshot.docs.length; index += 500) {
        const batch = db.batch();
        snapshot.docs.slice(index, index + 500).forEach((document) => batch.delete(document.ref));
        await batch.commit();
    }

    return snapshot.docs.map((document) => document.data());
};

export const renameUser = async (
    _: AdminUserActionState,
    formData: FormData
): Promise<AdminUserActionState> => {
    if (!(await checkAdmin())) {
        return { error: "K této akci nemáte oprávnění." };
    }

    const userId = formData.get("userId");
    const name = formData.get("name");
    if (typeof userId !== "string" || typeof name !== "string") {
        return { error: "Neplatné údaje uživatele." };
    }

    const normalizedName = name.trim();
    if (!normalizedName || normalizedName.length > MAX_NAME_LENGTH) {
        return { error: "Zobrazované jméno musí mít 1 až 50 znaků." };
    }

    const userRef = db.collection("users").doc(userId);
    if (!(await userRef.get()).exists) {
        return { error: "Uživatel nebyl nalezen." };
    }

    await userRef.update({ name: normalizedName });
    revalidateUserData(userId);
    revalidatePath("/admin/uzivatele");

    return { success: true };
};

export const deleteUser = async (userId: string): Promise<AdminUserActionState> => {
    if (!(await checkAdmin())) {
        return { error: "K této akci nemáte oprávnění." };
    }

    if (userId === ADMIN_USER_ID) {
        return { error: "Vlastní administrátorský účet nelze odstranit." };
    }

    const userRef = db.collection("users").doc(userId);
    if (!(await userRef.get()).exists) {
        return { error: "Uživatel nebyl nalezen." };
    }

    const [ratings, visits] = await Promise.all([
        deleteDocumentsByUser("ratings", userId),
        deleteDocumentsByUser("visits", userId),
        deleteDocumentsByUser("favourites", userId),
        deleteDocumentsByUser("accounts", userId),
        deleteDocumentsByUser("sessions", userId),
    ]);

    await storageBucket.deleteFiles({ prefix: `users/${userId}/` });
    await userRef.delete();

    ratings.forEach((rating) => {
        if (typeof rating.tower_id === "string") {
            updateTag(getCacheTagSpecific(CacheTag.TowerRatingAndCount, rating.tower_id));
            updateTag(getCacheTagSpecific(CacheTag.TowerRatings, rating.tower_id));
        }
    });
    visits.forEach((visit) => {
        if (typeof visit.tower_id === "string") {
            updateTag(getCacheTagSpecific(CacheTag.TowerVisits, visit.tower_id));
            updateTag(getCacheTagSpecific(CacheTag.TowerVisitsCount, visit.tower_id));
        }
    });

    updateTag(CacheTag.RatingsCount);
    updateTag(CacheTag.VisitsCount);
    revalidateUserData(userId);
    revalidatePath("/admin/uzivatele");

    return { success: true };
};
