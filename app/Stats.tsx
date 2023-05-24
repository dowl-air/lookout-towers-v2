import { doc, getDoc } from "firebase/firestore";
import React from "react";
import { db } from "./firebase";

export const revalidate = 3600;

const getChangesNumber = async (): Promise<number> => {
    const docSnap = await getDoc(doc(db, "changes", "meta"));
    return docSnap.exists() ? docSnap.data().count : 0;
};

const getRatingsNumber = async (): Promise<number> => {
    const docSnap = await getDoc(doc(db, "ratings", "meta"));
    return docSnap.exists() ? docSnap.data().count : 0;
};

const getUsersNumber = async (): Promise<number> => {
    const docSnap = await getDoc(doc(db, "users", "meta"));
    return docSnap.exists() ? docSnap.data().count : 0;
};

const getTowersNumber = async (): Promise<number> => {
    const docSnap = await getDoc(doc(db, "towers_base", "meta")); //todo change
    return docSnap.exists() ? docSnap.data().count : 0;
};

const getTowersDate = async (): Promise<Date> => {
    const docSnap = await getDoc(doc(db, "towers_base", "meta")); //todo change
    return docSnap.exists() ? docSnap.data().changed.toDate() : new Date();
};

async function Stats() {
    const changesNumberPromise: Promise<number> = getChangesNumber();
    const ratingsNumberPromise: Promise<number> = getRatingsNumber();
    const usersNumberPromise: Promise<number> = getUsersNumber();
    const towersNumberPromise: Promise<number> = getTowersNumber();
    const towersDatePromise: Promise<Date> = getTowersDate();

    const [changesNumber, ratingsNumber, usersNumber, towersNumber, towersDate] = await Promise.all([
        changesNumberPromise,
        ratingsNumberPromise,
        usersNumberPromise,
        towersNumberPromise,
        towersDatePromise,
    ]);

    return (
        <div className="stats bg-secondary text-secondary-content stats-vertical md:stats-horizontal mt-10">
            <div className="stat">
                <div className="stat-title text-secondary-content">Rozhleden v databázi</div>
                <div className="stat-value">{towersNumber}</div>
            </div>

            <div className="stat inline-grid md:hidden lg:inline-grid">
                <div className="stat-title text-secondary-content">Aktivních uživatelů</div>
                <div className="stat-value">{usersNumber}</div>
            </div>
            <div className="stat">
                <div className="stat-title text-secondary-content">Provedených úprav</div>
                <div className="stat-value">{changesNumber}</div>
            </div>
            <div className="stat">
                <div className="stat-title text-secondary-content">Přidaných hodnocení</div>
                <div className="stat-value">{ratingsNumber}</div>
            </div>
            <div className="stat">
                <div className="stat-title text-secondary-content">Poslední změna</div>
                <div className="stat-value">{`${towersDate.getDate()}. ${towersDate.getMonth() + 1}. ${towersDate.getFullYear()}`}</div>
            </div>
        </div>
    );
}

export default Stats;
