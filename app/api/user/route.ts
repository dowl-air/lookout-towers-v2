import { db } from "@/app/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userID = searchParams.get("user_id");
    if (!userID) return NextResponse.json({
        status: 400,
        message: "Wrong parameters provided."
    })

    const snap = await getDoc(doc(db, "users", userID));
    return snap.exists() ? NextResponse.json({status: 200, message: snap.data()}) : NextResponse.json({status: 404});
}