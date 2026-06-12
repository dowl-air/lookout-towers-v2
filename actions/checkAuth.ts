"use server";

import { User } from "next-auth";

import { auth } from "@/auth";

export const checkAuth = async (): Promise<User | null> => {
    const session = await auth();
    if (session?.user) return session.user;
    return null;
};
