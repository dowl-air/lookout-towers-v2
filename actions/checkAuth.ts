"use server";
import { auth } from "@/auth";
import { User } from "next-auth";

export const checkAuth = async (): Promise<User> => {
    const session = await auth();
    if (!session) {
        throw new Error("Unauthorized");
    }
    return session.user;
};