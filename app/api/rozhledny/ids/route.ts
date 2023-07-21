import { NextResponse } from 'next/server';
import { Tower, TowerFirebase } from "@/typings";
import { collection, getDocs, query, where, documentId } from "firebase/firestore";
import { normalizeTowerObject } from "@/utils/normalizeTowerObject";
import { db } from '@/app/firebase';


type Params = {
    ids: string[];
}

export async function POST(request: Request) {
    const params : Params = await request.json() as Params;

    if (!params.ids || params.ids.length === 0) return NextResponse.json({status: 400});

    const q = query(collection(db, "towers"), where(documentId(), "in", params.ids));

    const towers: Tower[] = [];
    const snap = await getDocs(q);
    snap.forEach((doc) => {
        towers.push(normalizeTowerObject(doc.data() as TowerFirebase));
    });
    return NextResponse.json(towers);
}