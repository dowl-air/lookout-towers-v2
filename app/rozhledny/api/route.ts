import { NextResponse } from 'next/server';
import { Filter, Tower, TowerFirebase } from "@/typings";
import { doc, collection, startAfter, getDocs, getDoc, limit, orderBy, query, where, DocumentSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { normalizeTowerObject } from "@/utils/normalizeTowerObject";

const getFilteredTowers = async (filter: Filter, previousElm: DocumentSnapshot): Promise<Tower[]> => {
    const towers: Tower[] = [];
    const q = query(
        collection(db, "towers"),
        where("name", ">=", filter.searchTerm),
        where("name", "<=", filter.searchTerm + "\uf8ff"),
        orderBy("name"),
        startAfter(previousElm),
        limit(20)
    );
    const snap = await getDocs(q);
    snap.forEach((doc) => {
        towers.push(normalizeTowerObject(doc.data() as TowerFirebase));
    });
    return towers;
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    console.log(searchParams);

    const filter: Filter = {
        searchTerm: searchParams.get("searchTerm") || ""
    }
    const start: string = searchParams.get("startItemId") || "";
    let previousElm: any = false
    if (start) {
        previousElm = await getDoc(doc(db, "towers", start));
    }

    const towers: Tower[] = await getFilteredTowers(filter, previousElm);
    console.log(towers.length);

    return NextResponse.json(towers);
}