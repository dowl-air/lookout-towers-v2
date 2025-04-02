"use server";

import { checkAuth } from "@/actions/checkAuth";
import { getTowerObjectByNameID } from "@/actions/towers/towers.action";
import { OpeningHoursType } from "@/types/OpeningHours";
import { Tower } from "@/types/Tower";
import { db } from "@/utils/firebase";
import { addDoc, collection, serverTimestamp, updateDoc } from "firebase/firestore";

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

    const newTowerRef = await addDoc(collection(db, "towers"), tower);
    await updateDoc(newTowerRef, {
        id: newTowerRef.id,
        nameID,
        created: serverTimestamp(),
        modified: serverTimestamp(),
        random: Math.random(),
    });
};
