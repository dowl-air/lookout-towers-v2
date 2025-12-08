import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { auth } from "@/auth";

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
