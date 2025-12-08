import { doc, getDoc } from "firebase/firestore";
import { cache } from "react";

import { verifyUser } from "@/data/auth";
import { User } from "@/types/User";
import { db } from "@/utils/firebase";

export const getCurrentUser = cache(async () => {
    const { userId } = await verifyUser();
    if (!userId) return null;

    try {
        const userSnap = await getDoc(doc(db, "users", userId));
        if (!userSnap.exists()) return null;

        const data = userSnap.data();
        const user: User = {
            id: userSnap.id,
            name: data.name,
            email: data.email,
            image: data.image,
        };

        return user;
    } catch (error) {
        console.log("Error fetching user data:", error);
        return null;
    }
});
