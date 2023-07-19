import { db } from "@/app/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

type Params = {
    towerID: string;
    userID: string;
    text: string;
    date: Date;
}

export async function POST(request: Request) {
    const params : Params = await request.json() as Params;

    if (!params.towerID || !params.userID || !params.date) return NextResponse.json({
        status: 400,
        message: "Wrong parameters provided."
    })

    await setDoc(doc(db, "visits", `${params.userID}_${params.towerID}`), {
        created: serverTimestamp(),
        user_id: params.userID,
        tower_id: params.towerID,
        text: params.text,
        date: params.date
    });

    return NextResponse.json({
        status: 201
    });
}