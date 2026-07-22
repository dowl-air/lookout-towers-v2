"use server";

import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { refresh, revalidatePath, updateTag } from "next/cache";

import { checkAuth } from "@/actions/checkAuth";
import { unstable_update } from "@/auth";
import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";
import { db, storage } from "@/utils/firebase";

const MAX_NAME_LENGTH = 50;
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export type ProfileUpdateState = {
    error?: string;
    success?: boolean;
};

export const updateProfile = async (
    _: ProfileUpdateState,
    formData: FormData
): Promise<ProfileUpdateState> => {
    const user = await checkAuth();
    if (!user) {
        return { error: "Pro úpravu profilu se musíte přihlásit." };
    }

    const name = formData.get("name");
    if (typeof name !== "string") {
        return { error: "Zadejte zobrazované jméno." };
    }

    const normalizedName = name.trim();
    if (!normalizedName || normalizedName.length > MAX_NAME_LENGTH) {
        return { error: "Zobrazované jméno musí mít 1 až 50 znaků." };
    }

    const avatar = formData.get("avatar");
    let image = user.image;
    if (avatar instanceof File && avatar.size > 0) {
        if (!ALLOWED_AVATAR_TYPES.has(avatar.type)) {
            return { error: "Fotka musí být ve formátu JPG, PNG nebo WebP." };
        }

        if (avatar.size > MAX_AVATAR_SIZE) {
            return { error: "Fotka může mít maximálně 5 MB." };
        }

        try {
            const storageRef = ref(storage, `users/${user.id}/avatar`);
            const snapshot = await uploadBytes(storageRef, avatar);
            const imageUrl = new URL(await getDownloadURL(snapshot.ref));
            imageUrl.searchParams.set("v", Date.now().toString());
            image = imageUrl.toString();

            await updateDoc(doc(db, "users", user.id), {
                image,
                name: normalizedName,
            });
        } catch (error) {
            console.error("Error updating profile avatar:", error);
            return { error: "Profil se nepodařilo uložit. Zkuste to prosím znovu." };
        }
    } else {
        await updateDoc(doc(db, "users", user.id), { name: normalizedName });
    }

    await unstable_update({ user: { image, name: normalizedName } });
    updateTag(getCacheTagSpecific(CacheTag.User, user.id));
    revalidatePath("/profil");
    refresh();

    return { success: true };
};
