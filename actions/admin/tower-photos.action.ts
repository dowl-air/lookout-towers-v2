"use server";

import { FieldValue } from "firebase-admin/firestore";
import { updateTag } from "next/cache";

import { checkAdmin } from "@/actions/checkAdmin";
import { trackAnalyticsEvent } from "@/utils/analytics.server";
import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";
import { db, storageBucket } from "@/utils/firebase-admin";
import { isSamePhotoUrl } from "@/utils/photoUrl";

export type AdminTowerPhoto =
    | {
          kind: "gallery";
          storagePath: string;
      }
    | {
          kind: "user";
          photoId: string;
      };

export type TowerPhotoActionState = {
    error?: string;
    success?: boolean;
};

const getGalleryPhotoUrl = (storagePath: string) =>
    `https://firebasestorage.googleapis.com/v0/b/${storageBucket.name}/o/${encodeURIComponent(storagePath)}?alt=media`;

const invalidateTowerPhotoCaches = (towerId: string, nameId: string) => {
    updateTag(CacheTag.Photo);
    updateTag(CacheTag.Towers);
    updateTag(CacheTag.TowersMap);
    updateTag(CacheTag.RandomTowers);
    updateTag(CacheTag.TowerOfTheDay);
    updateTag(CacheTag.LastChangeDate);
    updateTag(getCacheTagSpecific(CacheTag.Tower, towerId));
    updateTag(getCacheTagSpecific(CacheTag.Tower, nameId));
    updateTag(getCacheTagSpecific(CacheTag.TowerGallery, towerId));
    updateTag(getCacheTagSpecific(CacheTag.TowerPhotos, towerId));
};

const getTower = async (towerId: string) => {
    const towerSnapshot = await db.collection("towers").doc(towerId).get();
    if (!towerSnapshot.exists) return null;

    const nameId = towerSnapshot.get("nameID");
    if (typeof nameId !== "string") return null;

    return { snapshot: towerSnapshot, nameId };
};

const resolvePhoto = async (towerId: string, photo: AdminTowerPhoto) => {
    if (photo.kind === "gallery") {
        const expectedPrefix = `towers/${towerId}/`;
        if (!photo.storagePath.startsWith(expectedPrefix) || photo.storagePath === expectedPrefix) {
            return null;
        }

        const file = storageBucket.file(photo.storagePath);
        const [exists] = await file.exists();
        if (!exists) return null;

        return { url: getGalleryPhotoUrl(photo.storagePath), file };
    }

    const photoReference = db.collection("photos").doc(photo.photoId);
    const photoSnapshot = await photoReference.get();
    if (
        !photoSnapshot.exists ||
        photoSnapshot.get("tower_id") !== towerId ||
        photoSnapshot.get("isPublic") !== true
    ) {
        return null;
    }

    const url = photoSnapshot.get("url");
    if (typeof url !== "string") return null;

    return {
        url,
        file: storageBucket.file(`towers_users/${towerId}/${photo.photoId}`),
        photoReference,
    };
};

export const setTowerMainPhoto = async (
    towerId: string,
    photo: AdminTowerPhoto
): Promise<TowerPhotoActionState> => {
    if (!(await checkAdmin())) return { error: "K této akci nemáte oprávnění." };

    const [tower, resolvedPhoto, photos] = await Promise.all([
        getTower(towerId),
        resolvePhoto(towerId, photo),
        db.collection("photos").where("tower_id", "==", towerId).get(),
    ]);
    if (!tower) return { error: "Rozhledna nebyla nalezena." };
    if (!resolvedPhoto) return { error: "Fotografie nebyla nalezena." };

    const batch = db.batch();
    batch.update(tower.snapshot.ref, {
        mainPhotoUrl: resolvedPhoto.url,
        modified: FieldValue.serverTimestamp(),
    });
    photos.docs.forEach((document) => {
        batch.update(document.ref, {
            isMain: photo.kind === "user" && document.id === photo.photoId,
        });
    });
    await batch.commit();

    invalidateTowerPhotoCaches(towerId, tower.nameId);
    void trackAnalyticsEvent("Tower main photo changed", { photoType: photo.kind });
    return { success: true };
};

export const removeTowerPhoto = async (
    towerId: string,
    photo: AdminTowerPhoto
): Promise<TowerPhotoActionState> => {
    if (!(await checkAdmin())) return { error: "K této akci nemáte oprávnění." };

    const [tower, resolvedPhoto] = await Promise.all([
        getTower(towerId),
        resolvePhoto(towerId, photo),
    ]);
    if (!tower) return { error: "Rozhledna nebyla nalezena." };
    if (!resolvedPhoto) return { error: "Fotografie nebyla nalezena." };
    const mainPhotoUrl = tower.snapshot.get("mainPhotoUrl");
    if (typeof mainPhotoUrl === "string" && isSamePhotoUrl(mainPhotoUrl, resolvedPhoto.url)) {
        return { error: "Před smazáním hlavní fotografie označte jako hlavní jinou." };
    }

    await resolvedPhoto.file.delete();
    if ("photoReference" in resolvedPhoto) {
        await resolvedPhoto.photoReference.delete();
    }

    invalidateTowerPhotoCaches(towerId, tower.nameId);
    void trackAnalyticsEvent("Tower photo deleted", { photoType: photo.kind });
    return { success: true };
};
