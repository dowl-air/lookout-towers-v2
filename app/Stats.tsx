import { collection, doc, getCountFromServer, getDoc, getDocs, limit, orderBy, query } from "firebase/firestore";
import React from "react";
import { db } from "./firebase";
import { Tower, TowerFirebase } from "@/typings";
import { normalizeTowerObject } from "@/utils/normalizeTowerObject";

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
    const usersCol = collection(db, "users");
    const snapshot = await getCountFromServer(usersCol);
    return snapshot.data().count;
};

const getTowersNumber = async (): Promise<number> => {
    const towersCol = collection(db, "towers");
    const snapshot = await getCountFromServer(towersCol);
    return snapshot.data().count;
};

const getTowersDate = async (): Promise<Date> => {
    const q = query(collection(db, "towers"), orderBy("modified"), limit(1));
    const querySnapshot = await getDocs(q);
    let myDate = new Date();
    querySnapshot.forEach((doc) => {
        const tower: Tower = normalizeTowerObject(doc.data() as TowerFirebase);
        myDate = tower.modified;
    });
    return myDate;
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
        <>
            <div className="stats bg-primary text-primary-content stats-horizontal mt-10 hidden lg:inline-grid">
                <div className="stat">
                    <div className="stat-title text-primary-content">Rozhleden v databázi</div>
                    <div className="stat-value">{towersNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">Aktivních uživatelů</div>
                    <div className="stat-value">{usersNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">Provedených úprav</div>
                    <div className="stat-value">{changesNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">Přidaných hodnocení</div>
                    <div className="stat-value">{ratingsNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">Poslední změna</div>
                    <div className="stat-value">{`${towersDate.getDate()}. ${towersDate.getMonth() + 1}. ${towersDate.getFullYear()}`}</div>
                </div>
            </div>

            <div className="stats bg-primary text-primary-content stats-horizontal mt-10 hidden sm:inline-grid lg:hidden">
                <div className="stat">
                    <div className="stat-title text-primary-content">Rozhleden v databázi</div>
                    <div className="stat-value">{towersNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">Aktivních uživatelů</div>
                    <div className="stat-value">{usersNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">Provedených úprav</div>
                    <div className="stat-value">{changesNumber}</div>
                </div>
            </div>
            <div className="stats bg-primary text-primary-content stats-horizontal mt-3 hidden sm:inline-grid lg:hidden">
                <div className="stat">
                    <div className="stat-title text-primary-content">Přidaných hodnocení</div>
                    <div className="stat-value">{ratingsNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">Poslední změna</div>
                    <div className="stat-value">{`${towersDate.getDate()}. ${towersDate.getMonth() + 1}. ${towersDate.getFullYear()}`}</div>
                </div>
            </div>

            <div className="stats bg-primary text-primary-content stats-horizontal mt-10 hidden min-[400px]:inline-grid sm:hidden">
                <div className="stat">
                    <div className="stat-title text-primary-content">Rozhleden v databázi</div>
                    <div className="stat-value">{towersNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">Aktivních uživatelů</div>
                    <div className="stat-value">{usersNumber}</div>
                </div>
            </div>
            <div className="stats bg-primary text-primary-content stats-horizontal mt-3 hidden min-[400px]:inline-grid sm:hidden">
                <div className="stat">
                    <div className="stat-title text-primary-content">Provedených úprav</div>
                    <div className="stat-value">{changesNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">Přidaných hodnocení</div>
                    <div className="stat-value">{ratingsNumber}</div>
                </div>
            </div>
            <div className="stats bg-primary text-primary-content stats-vertical hidden mt-3 min-[400px]:inline-grid sm:hidden">
                <div className="stat">
                    <div className="stat-title text-primary-content">Poslední změna</div>
                    <div className="stat-value">{`${towersDate.getDate()}. ${towersDate.getMonth() + 1}. ${towersDate.getFullYear()}`}</div>
                </div>
            </div>

            <div className="stats bg-primary text-primary-content stats-vertical w-[calc(100%-25px)] mt-10 inline-grid min-[400px]:hidden">
                <div className="stat">
                    <div className="stat-title text-primary-content">Rozhleden v databázi</div>
                    <div className="stat-value">{towersNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">Aktivních uživatelů</div>
                    <div className="stat-value">{usersNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">Provedených úprav</div>
                    <div className="stat-value">{changesNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">Přidaných hodnocení</div>
                    <div className="stat-value">{ratingsNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">Poslední změna</div>
                    <div className="stat-value">{`${towersDate.getDate()}. ${towersDate.getMonth() + 1}. ${towersDate.getFullYear()}`}</div>
                </div>
            </div>
        </>
    );
}

export default Stats;
