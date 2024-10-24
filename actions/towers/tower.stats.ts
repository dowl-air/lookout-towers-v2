"use server";

import { CacheTag } from "@/utils/cacheTags";
import { db } from "@/utils/firebase";
import { Timestamp, collection, getCountFromServer, getDocs, limit, orderBy, query } from "firebase/firestore";
import { unstable_cache as cache } from "next/cache";

export const getChangesCount = cache(
    async (): Promise<number> => {
        const snap = await getCountFromServer(collection(db, "changes"));
        return snap.data().count;
    },
    [CacheTag.ChangesCount],
    {
        revalidate: 60 * 60 * 24 * 7, // 1 week backup revalidation
        tags: [CacheTag.ChangesCount],
    }
);

export const getRatingsCount = cache(
    async (): Promise<number> => {
        const snap = await getCountFromServer(collection(db, "ratings"));
        return snap.data().count;
    },
    [CacheTag.RatingsCount],
    {
        revalidate: 60 * 60 * 24 * 7, // 1 week backup revalidation
        tags: [CacheTag.RatingsCount],
    }
);

export const getUsersCount = cache(
    async (): Promise<number> => {
        const snap = await getCountFromServer(collection(db, "users"));
        return snap.data().count;
    },
    [CacheTag.UsersCount],
    {
        revalidate: 60 * 60 * 24 * 7, // 1 week backup revalidation
        tags: [CacheTag.UsersCount],
    }
);

export const getTowersCount = cache(
    async (): Promise<number> => {
        const snap = await getCountFromServer(collection(db, "towers"));
        return snap.data().count;
    },
    [CacheTag.TowersCount],
    {
        revalidate: 60 * 60 * 24 * 7, // 1 week backup revalidation
        tags: [CacheTag.TowersCount],
    }
);

export const getLastModifiedTowerDate = cache(
    async (): Promise<Date> => {
        const q = query(collection(db, "towers"), orderBy("modified"), limit(1));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) return new Date();

        const doc = querySnapshot.docs[0];
        const data = doc.data();
        return (data.modified as Timestamp).toDate();
    },
    [CacheTag.LastChangeDate],
    {
        revalidate: 60 * 60 * 24 * 7, // 1 week backup revalidation
        tags: [CacheTag.LastChangeDate],
    }
);
