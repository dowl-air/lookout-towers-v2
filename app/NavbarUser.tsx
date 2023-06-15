"use client";
import React from "react";
import ProfileIconButton from "./ProfileIconButton";
import LoginButton from "./LoginButton";
import { useSession } from "next-auth/react";

function NavbarUser() {
    const { data: session, status } = useSession();

    if (status === "loading") return <div className="w-[48px] h-[48px]"></div>;

    return <>{status === "authenticated" ? <ProfileIconButton user={session.user} /> : <LoginButton />}</>;
}

export default NavbarUser;
