import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import React from "react";
import ProfileIconButton from "./ProfileIconButton";
import LoginButton from "./LoginButton";

async function NavbarUser() {
    const session = await getServerSession(authOptions);

    return <>{session ? <ProfileIconButton user={session.user} /> : <LoginButton />}</>;
}

export default NavbarUser;
