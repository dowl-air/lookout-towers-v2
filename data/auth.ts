import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { auth } from "@/auth";

/**
 * Verify if user is authenticated, redirect to signin if not
 *
 * Use only when the user must be authenticated to access the page or data.
 */
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

/**
 * Check if user is authenticated without redirecting
 */
export const checkUser = cache(async () => {
    const session = await auth();

    if (!session?.user) {
        return { isAuth: false, userId: null };
    }

    return { isAuth: true, userId: session.user.id };
});
