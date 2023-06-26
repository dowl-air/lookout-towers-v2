import { db } from "@/app/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

type Params = {
    towerID: string;
    userID: string;
    text: string;
    rating: number;
}

export async function POST(request: Request) {
    const params : Params = await request.json() as Params;

    if (!params.towerID || !params.userID) return NextResponse.json({
        status: 400,
        message: "Wrong parameters provided."
    })

    await setDoc(doc(db, "ratings", `${params.userID}_${params.towerID}`), {
        created: serverTimestamp(),
        user_id: params.userID,
        tower_id: params.towerID,
        text: params.text,
        rating: params.rating
    });

    return NextResponse.json({
        status: 201
    });
}