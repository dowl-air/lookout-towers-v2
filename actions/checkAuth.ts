"use server";
import { auth } from "@/auth";
import { User } from "next-auth";

export const checkAuth = async (): Promise<User | null> => {
    const session = await auth();
    if (session?.user) return session.user;
    return null;
};
