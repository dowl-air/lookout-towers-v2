"use server";

import { Rating } from "@/typings";
import { checkAuth } from "../checkAuth";
import { Timestamp, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { getUser } from "../members/members.action";

export const getUserRating = async (towerID: string): Promise<Rating | null> => {
    const user = await checkAuth();
    if (!user) return null;
    const [snap, member] = await Promise.all([await getDoc(doc(db, "ratings", `${user.id}_${towerID}`)), getUser(user.id)]);
    if (!snap.exists()) return null;
    const data = snap.data();
    return { ...data, created: (data.created as Timestamp).toDate(), user: member } as Rating;
};

export const getTowerRatings = async (towerID: string): Promise<Rating[]> => {
    const q = query(collection(db, "ratings"), where("tower_id", "==", towerID));
    const querySnapshot = await getDocs(q);
    const ratings: Rating[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        ratings.push({ ...data, created: (data.created as Timestamp).toDate() } as Rating);
    });
    return ratings;
};

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
};

export const removeRating = async (towerID: string) => {
    const user = await checkAuth();
    await deleteDoc(doc(db, "ratings", `${user.id}_${towerID}`));
};

export const getAllUserRatings = async () => {
    const user = await checkAuth();
    if (!user) return [];
    const q = query(collection(db, "ratings"), where("user_id", "==", user.id));
    const querySnapshot = await getDocs(q);
    const ratings: Rating[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        ratings.push({ ...data, created: (data.created as Timestamp).toDate() } as Rating);
    });
    return ratings;
};
