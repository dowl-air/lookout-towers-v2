"use server";
import { Visit } from "@/typings";
import { checkAuth } from "../checkAuth";
import { Timestamp, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db } from "@/utils/firebase";

export const getVisit = async (towerID: string): Promise<Visit | null> => {
    const user = await checkAuth();
    const snap = await getDoc(doc(db, "visits", `${user.id}_${towerID}`));
    if (!snap.exists()) return null;
    const data = snap.data();
    return { ...data, date: new Date(data.date), created: (data.created as Timestamp).toDate() } as Visit;
};

export const setVisit = async (towerID: string, visit: Omit<Visit, "created" | "user_id" | "tower_id">) => {
    const user = await checkAuth();
    await setDoc(doc(db, "visits", `${user.id}_${towerID}`), {
        ...visit,
        date: visit.date.toISOString(),
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

export const getAllUserVisits = async (): Promise<Visit[]> => {
    const user = await checkAuth();
    if (!user) return [];
    const visits: Visit[] = [];
    const q = await query(collection(db, "visits"), where("user_id", "==", user.id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        visits.push({ ...data, date: new Date(data.date), created: (data.created as Timestamp).toDate() } as Visit);
    });
    return visits;
};
