import { db } from "@/app/firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userID = searchParams.get("user_id");
    const towerID = searchParams.get("tower_id");

    if (userID && towerID) {
        const snap = await getDoc(doc(db, "ratings", `${userID}_${towerID}`));
        return snap.exists() ? NextResponse.json({status: 200, message: snap.data()}) : NextResponse.json({status: 404});
    }

    if (towerID) {
        const q = query(collection(db, "ratings"), where("tower_id", "==", towerID));
        const querySnapshot = await getDocs(q);
        const reviews : any[] = [];
        querySnapshot.forEach((doc) => {
            reviews.push(doc.data())
        });
        return NextResponse.json({status: 200, message: reviews});
    }

    if (userID) {
        const q = query(collection(db, "ratings"), where("user_id", "==", userID));
        const querySnapshot = await getDocs(q);
        const reviews : any[] = [];
        querySnapshot.forEach((doc) => {
            reviews.push(doc.data())
        });
        return NextResponse.json({status: 200, message: reviews});
    }

    return NextResponse.json({
        status: 400,
        message: "Wrong parametres provided."
    });
}