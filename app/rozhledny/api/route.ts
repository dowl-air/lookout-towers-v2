import { NextResponse } from 'next/server';
import { Filter, Tower, TowerFirebase } from "@/typings";
import { doc, collection, startAfter, getDocs, getDoc, limit, orderBy, query, where, DocumentSnapshot, Query } from "firebase/firestore";
import { db } from "../../firebase";
import { normalizeTowerObject } from "@/utils/normalizeTowerObject";

const createQuery = (filter: Filter, previousElm: DocumentSnapshot) : Query => {
    if (filter.county && filter.province) return query(
        collection(db, "towers"),
        where("name", ">=", filter.searchTerm),
        where("name", "<=", filter.searchTerm + "\uf8ff"),
        where("province", "==", filter.province),
        where("county", "==", filter.county),
        orderBy("name"),
        startAfter(previousElm),
        limit(20)
    );
    if (filter.province) return query(
        collection(db, "towers"),
        where("name", ">=", filter.searchTerm),
        where("name", "<=", filter.searchTerm + "\uf8ff"),
        where("province", "==", filter.province),
        orderBy("name"),
        startAfter(previousElm),
        limit(20)
    );
    return query(
        collection(db, "towers"),
        where("name", ">=", filter.searchTerm),
        where("name", "<=", filter.searchTerm + "\uf8ff"),
        orderBy("name"),
        startAfter(previousElm),
        limit(20)
    );
}


const getFilteredTowers = async (filter: Filter, previousElm: DocumentSnapshot): Promise<Tower[]> => {
    const towers: Tower[] = [];
    const q = createQuery(filter, previousElm);
    const snap = await getDocs(q);
    snap.forEach((doc) => {
        towers.push(normalizeTowerObject(doc.data() as TowerFirebase));
    });
    return towers;
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const filter: Filter = {
        searchTerm: searchParams.get("searchTerm") || "",
        province: searchParams.get("province") || "",
        county: searchParams.get("county") || "",
    }
    const start: string = searchParams.get("startItemId") || "";
    let previousElm: any = false
    if (start) {
        previousElm = await getDoc(doc(db, "towers", start));
    }

    const towers: Tower[] = await getFilteredTowers(filter, previousElm);

    return NextResponse.json(towers);
}