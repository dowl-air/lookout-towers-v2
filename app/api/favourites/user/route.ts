import { db } from "@/app/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userID = searchParams.get("user_id");
    if (!userID) return NextResponse.json({
        status: 400,
        message: "Wrong parameters provided."
    })

    const q = query(collection(db, "favourites"), where("user_id", "==", userID));
    const querySnapshot = await getDocs(q);
    const tower_ids: any[] = [];
    querySnapshot.forEach((doc) => {
        const obj = doc.data();
        tower_ids.push(obj.tower_id);
    });
    return NextResponse.json({status: 200, message: tower_ids});
}