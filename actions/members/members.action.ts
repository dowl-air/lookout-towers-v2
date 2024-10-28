"use server";
import { collection, doc, getCountFromServer, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";

import { db } from "@/utils/firebase";
import { Tower, User } from "@/typings";
import { unstable_cache as cache } from "next/cache";
import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";

export const getAllMembers = async () => {
    //todo add caching
    const snap = await getDocs(collection(db, "users"));
    const users: User[] = snap.docs.map((doc) => {
        return { ...doc.data(), id: doc.id } as User;
    });

    // get visits count for each user
    await Promise.all(
        users.map(async (user) => {
            const q = query(collection(db, "visits"), where("user_id", "==", user.id));
            const snap = await getCountFromServer(q);
            user.visits = snap.data().count;
        })
    );

    //get last visited tower for each user
    await Promise.all(
        users.map(async (user) => {
            const q = query(collection(db, "visits"), where("user_id", "==", user.id), orderBy("date", "desc"), limit(1));
            const snap = await getDocs(q);
            if (snap.empty) return;
            const towerID = snap.docs[0].data().tower_id;
            const towerSnap = await getDoc(doc(db, "towers", towerID));
            user.lastVisited = { tower: towerSnap.data() as Tower, date: snap.docs[0].data().date };
        })
    );

    //get changes made by each user
    await Promise.all(
        users.map(async (user) => {
            const q = query(collection(db, "changes"), where("userID", "==", user.id));
            const snap = await getCountFromServer(q);
            user.changes = snap.data().count;
        })
    );

    return users;
};

export const getUser = async (id: string) => {
    const cachedFn = cache(
        async (id: string) => {
            const snap = await getDoc(doc(db, "users", id));
            const user = snap.data() as User;
            user.id = snap.id;
            return user;
        },
        [CacheTag.User],
        {
            tags: [CacheTag.User, getCacheTagSpecific(CacheTag.User, id)],
        }
    );
    return cachedFn(id);
};
