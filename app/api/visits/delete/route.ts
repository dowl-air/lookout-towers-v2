import { db } from "@/app/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);

    const userID = searchParams.get("user_id");
    const towerID = searchParams.get("tower_id");
    if (!towerID || !userID) return NextResponse.json({
        status: 400,
        message: "Wrong parameters provided."
    })

    await deleteDoc(doc(db, "visits", `${userID}_${towerID}`));

    return NextResponse.json({
        status: 200
    });
}