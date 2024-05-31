"use server";

import { db } from "@/app/firebase";
import { Timestamp, collection, getCountFromServer, getDocs, limit, orderBy, query } from "firebase/firestore";

export const getChangesCount = async (): Promise<number> => {
    const snap = await getCountFromServer(collection(db, "changes"));
    return snap.data().count;
};

export const getRatingsCount = async (): Promise<number> => {
    const snap = await getCountFromServer(collection(db, "ratings"));
    return snap.data().count;
};

export const getUsersCount = async (): Promise<number> => {
    const snap = await getCountFromServer(collection(db, "users"));
    return snap.data().count;
};

export const getTowersCount = async (): Promise<number> => {
    const snap = await getCountFromServer(collection(db, "towers"));
    return snap.data().count;
};

export const getLastModifiedTowerDate = async (): Promise<Date> => {
    const q = query(collection(db, "towers"), orderBy("modified"), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return new Date();

    const doc = querySnapshot.docs[0];
    const data = doc.data();
    return (data.modified as Timestamp).toDate();
};