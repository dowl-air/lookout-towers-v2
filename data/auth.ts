import "server-only";

import { redirect } from "next/navigation";
import { User } from "next-auth";
import { cache } from "react";

import { auth } from "@/auth";

export const checkAuth = async (): Promise<User | null> => {
    const session = await auth();
    if (session?.user) return session.user;
    return null;
};

export const verifyUser = cache(async () => {
    const session = await auth();

    if (!session?.user) {
        redirect("/signin");
    }

    return {
        isAuth: true,
        userId: session.user.id,
        isAdmin: session.user.id === "iMKZNJV5PE4XQjnKmZut",
    };
});
