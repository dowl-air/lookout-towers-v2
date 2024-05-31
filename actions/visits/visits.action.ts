"use server";
import { Visit } from "@/typings";
import { checkAuth } from "../checkAuth";
import { Timestamp, deleteDoc, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";

export const getVisit = async (towerID: string): Promise<Visit|null> => {
    const user = await checkAuth();
    const snap = await getDoc(doc(db, "visits", `${user.id}_${towerID}`));
    if (!snap.exists()) return null;
    const data = snap.data();
    return {...data, date: (data.date as Timestamp).toDate() } as Visit;
};

export const setVisit = async (towerID: string, visit: Omit<Visit, "created"|"user_id"|"tower_id">) => {
    const user = await checkAuth();
    await setDoc(doc(db, "visits", `${user.id}_${towerID}`), {
        ...visit,
        created: serverTimestamp(),
        user_id: user.id,
        tower_id: towerID,
    });
    return true;
};

export const removeVisit = async (towerID: string) => {
    const user = await checkAuth();
    await deleteDoc(doc(db, "visits", `${user.id}_${towerID}`));
    return false;
};