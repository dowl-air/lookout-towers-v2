import { db } from "@/app/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userID = searchParams.get("user_id");
    const towerID = searchParams.get("tower_id");
    if (!towerID || !userID) return NextResponse.json({
        status: 400,
        message: "Wrong parameters provided."
    })

    const snap = await getDoc(doc(db, "favourites", `${userID}_${towerID}`));
    return snap.exists() ? NextResponse.json({status: 200, message: snap.data()}) : NextResponse.json({status: 404});
}