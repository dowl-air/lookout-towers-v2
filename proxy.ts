import { NextResponse } from "next/server";

import { checkUser } from "@/data/auth";

export async function proxy(req: Request) {
    const { isAuth, isAdmin } = await checkUser();

    if (!isAuth) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    if (req.url.includes("purge-cache") && !isAdmin) {
        return NextResponse.redirect(new URL("/403", req.url));
    }

    if (req.url.includes("zmeny") && !isAdmin) {
        return NextResponse.redirect(new URL("/403", req.url));
    }
}

export const config = {
    matcher: [
        "/navstivene/:path*",
        "/komunita/:path*",
        "/pridat-rozhlednu/:path*",
        "/profil/:path*",
        "/purge-cache/:path*",
        "/zmeny/:path*",
    ],
};
