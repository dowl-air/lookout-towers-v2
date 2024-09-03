"use server";
import { collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";

import { checkAuth } from "@/actions/checkAuth";
import { db } from "@/utils/firebase";

export const checkFavourite = async (towerID: string) => {
    const user = await checkAuth();
    const snap = await getDoc(doc(db, "favourites", `${user.id}_${towerID}`));
    if (snap.exists()) return true;
    return false;
};

export const addToFavourites = async (towerID: string) => {
    const user = await checkAuth();
    await setDoc(doc(db, "favourites", `${user.id}_${towerID}`), {
        created: serverTimestamp(),
        user_id: user.id,
        tower_id: towerID,
    });
    return true;
};

export const removeFromFavourites = async (towerID: string) => {
    const user = await checkAuth();
    await deleteDoc(doc(db, "favourites", `${user.id}_${towerID}`));
    return false;
};

export const getAllUserFavouritesIds = async () => {
    const user = await checkAuth();
    if (!user) return [];
    const q = query(collection(db, "favourites"), where("user_id", "==", user.id));
    const querySnapshot = await getDocs(q);
    const favourites = [];
    querySnapshot.forEach((doc) => {
        favourites.push(doc.data().tower_id);
    });
    return favourites;
};
