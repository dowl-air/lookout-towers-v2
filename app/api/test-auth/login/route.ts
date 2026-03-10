import { NextRequest, NextResponse } from "next/server";

import { authFirestore } from "@/utils/authFirestore";

const TEST_USER = {
    id: "playwright-e2e-user",
    name: "Playwright User",
    email: "playwright@example.com",
    image: null,
};

const SESSION_COOKIE_NAME = "authjs.session-token";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost"]);

const isLocalE2ERequest = (request: NextRequest) => {
    if (process.env.NODE_ENV === "production") {
        return false;
    }

    return LOCAL_HOSTS.has(request.nextUrl.hostname);
};

export async function POST(request: NextRequest) {
    if (!isLocalE2ERequest(request)) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const sessionToken = crypto.randomUUID();
    const expires = new Date(Date.now() + SESSION_TTL_MS);

    const existingSessions = await authFirestore
        .collection("sessions")
        .where("userId", "==", TEST_USER.id)
        .get();

    const batch = authFirestore.batch();

    batch.set(
        authFirestore.collection("users").doc(TEST_USER.id),
        {
            ...TEST_USER,
            emailVerified: new Date(),
        },
        { merge: true }
    );

    existingSessions.forEach((session) => {
        batch.delete(session.ref);
    });

    batch.set(authFirestore.collection("sessions").doc(), {
        sessionToken,
        userId: TEST_USER.id,
        expires,
    });

    await batch.commit();

    const response = NextResponse.json({ ok: true, user: TEST_USER });

    response.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: sessionToken,
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        expires,
        path: "/",
    });

    return response;
}
