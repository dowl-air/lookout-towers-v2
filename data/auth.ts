import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@/auth";

/**
 * Verify if user is authenticated, redirect to signin if not
 *
 * Use only when the user must be authenticated to access the page or data.
 */
export const verifyUser = async () => {
    const session = await auth();

    if (!session?.user) {
        redirect("/signin");
    }

    return {
        isAuth: true,
        userId: session.user.id,
        isAdmin: session.user.id === "iMKZNJV5PE4XQjnKmZut",
    };
};

/**
 * Check if user is authenticated without redirecting
 */
export const checkUser = async () => {
    const session = await auth();

    if (!session?.user) {
        return { isAuth: false, isAdmin: false, userId: null };
    }

    return {
        isAuth: true,
        isAdmin: session.user.id === "iMKZNJV5PE4XQjnKmZut",
        userId: session.user.id,
    };
};
