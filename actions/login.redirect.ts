"use server";

import { signIn } from "@/auth";

export const loginRedirect = async () => {
    await signIn();
};
