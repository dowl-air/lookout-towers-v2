"use client";
import React from "react";
import ProfileIconButton from "./ProfileIconButton";
import LoginButton from "./LoginButton";
import { useSession } from "next-auth/react";

function NavbarUser() {
    const { data: session, status } = useSession();

    if (status === "loading") return <div className="sm:w-[48px] sm:h-[48px]"></div>;

    return <>{status === "authenticated" ? <ProfileIconButton user={session.user} /> : <LoginButton />}</>;
}

export default NavbarUser;
