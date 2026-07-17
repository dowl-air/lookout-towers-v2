"use server";

import { addDoc, collection, GeoPoint, serverTimestamp, updateDoc } from "firebase/firestore";
import { updateTag } from "next/cache";

import { checkAuth } from "@/actions/checkAuth";
import { getTowerObjectByNameID } from "@/data/tower/towers";
import { OpeningHoursType } from "@/types/OpeningHours";
import { Tower } from "@/types/Tower";
import { CacheTag } from "@/utils/cacheTags";
import { db } from "@/utils/firebase";
import { resolveUniqueNameID } from "@/utils/nameID";
import { getTowerValidationError } from "@/utils/towerValidation";

export const addTower = async (tower: Tower) => {
    const user = await checkAuth();
    if (!user) throw new Error("Unauthorized");

    const validationError = getTowerValidationError(tower);
    if (validationError) throw new Error(validationError);

    const nameID = await resolveUniqueNameID(tower.name, tower.county, async (candidate) =>
        Boolean(await getTowerObjectByNameID(candidate))
    );

    if (!tower.openingHours) {
        tower.openingHours = {
            type: OpeningHoursType.Unknown,
        };
    }

    tower.gps = new GeoPoint(tower.gps.latitude, tower.gps.longitude);

    const newTowerRef = await addDoc(collection(db, "towers"), tower);

    const updateObject = {
        id: newTowerRef.id,
        nameID,
        created: serverTimestamp(),
        modified: serverTimestamp(),
        random: Math.random(),
    };

    if (!tower.opened) updateObject["opened"] = serverTimestamp();
    if (!tower.stairs) updateObject["stairs"] = 0;
    if (!tower.elevation) updateObject["elevation"] = 0;
    if (!tower.height) updateObject["height"] = 0;

    await updateDoc(newTowerRef, updateObject);

    updateTag(CacheTag.Towers);
    updateTag(CacheTag.LastChangeDate);

    return newTowerRef.id;
};
