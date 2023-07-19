import { db } from "@/app/firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";

const DB_COL_NAME = "visits"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userID = searchParams.get("user_id");
    const towerID = searchParams.get("tower_id");

    if (userID && towerID) {
        const snap = await getDoc(doc(db, DB_COL_NAME, `${userID}_${towerID}`));
        if (!snap.exists()) return NextResponse.json({status: 404});
        const obj: any = snap.data();
        obj.date = new Date(Date.parse(obj.date));
        obj.created = obj.created.toDate();
        obj.id = snap.id;
        return NextResponse.json({status: 200, message: obj});
    }

    if (towerID) {
        const q = query(collection(db, DB_COL_NAME), where("tower_id", "==", towerID));
        const querySnapshot = await getDocs(q);
        const reviews : any[] = [];
        querySnapshot.forEach((doc) => {
            const obj: any = doc.data();
            obj.date = new Date(Date.parse(obj.date));
            obj.created = obj.created.toDate();
            obj.id = doc.id;
            reviews.push(obj)
        });
        return NextResponse.json({status: 200, message: reviews});
    }

    if (userID) {
        const q = query(collection(db, DB_COL_NAME), where("user_id", "==", userID));
        const querySnapshot = await getDocs(q);
        const reviews : any[] = [];
        querySnapshot.forEach((doc) => {
            const obj: any = doc.data();
            obj.date = new Date(Date.parse(obj.date));
            obj.created = obj.created.toDate();
            obj.id = doc.id;
            reviews.push(obj)
        });
        return NextResponse.json({status: 200, message: reviews});
    }

    return NextResponse.json({
        status: 400,
        message: "Wrong parametres provided."
    });
}