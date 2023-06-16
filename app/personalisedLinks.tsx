"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

export const Unsign = () => {
    const { data: session, status } = useSession();
    if (status === "authenticated") return <div onClick={() => signOut()}>Odhlásit se</div>;
    return <div onClick={() => signIn()}>Přilásit se</div>;
};
