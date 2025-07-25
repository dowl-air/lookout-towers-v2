"use server";

import { checkAuth } from "@/actions/checkAuth";
import { getTowerObjectByNameID } from "@/actions/towers/towers.action";
import { OpeningHoursType } from "@/types/OpeningHours";
import { Tower } from "@/types/Tower";
import { CacheTag } from "@/utils/cacheTags";
import { db, firebase } from "@/utils/firebase";
import { addDoc, collection, GeoPoint, serverTimestamp, updateDoc } from "firebase/firestore";
import { revalidateTag } from "next/cache";

export const addTower = async (tower: Tower) => {
    const user = await checkAuth();
    if (!user) throw new Error("Unauthorized");

    let nameID = tower.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("cs-CZ")
        .replace(/ /g, "_");
    const testNameID = await getTowerObjectByNameID(nameID);
    if (testNameID) {
        nameID = `${nameID}_${Math.floor(Math.random() * 1000)}`;
    }

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

    revalidateTag(CacheTag.Towers);
    revalidateTag(CacheTag.LastChangeDate);

    return newTowerRef.id;
};
