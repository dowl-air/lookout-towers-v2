"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import ClientLinkDrawerClose from "./ClientLinkDrawerClose";

export const Unsign = () => {
    const { data: session, status } = useSession();
    if (status === "authenticated") return <div onClick={() => signOut()}>Odhlásit se</div>;
    return <div onClick={() => signIn()}>Přihlásit se</div>;
};

export const ProfileClientButtonDrawer = () => {
    const { data: session, status } = useSession();
    if (status === "authenticated")
        return (
            <li>
                <ClientLinkDrawerClose text="Můj profil" href="/profil" />
            </li>
        );
    return <></>;
};
