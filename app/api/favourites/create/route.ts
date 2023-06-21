import { db } from "@/app/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);

    const userID = searchParams.get("user_id");
    const towerID = searchParams.get("tower_id");
    if (!towerID || !userID) return NextResponse.json({
        status: 400,
        message: "Wrong parameters provided."
    })

    await setDoc(doc(db, "favourites", `${userID}_${towerID}`), {
        created: serverTimestamp(),
        user_id: userID,
        tower_id: towerID,
    });

    return NextResponse.json({
        status: 201
    });
}