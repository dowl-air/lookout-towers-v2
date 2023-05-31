import React from "react";
import { Filter, Tower, TowerFirebase } from "@/typings";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { normalizeTowerObject } from "@/utils/normalizeTowerObject";
import TowerCard from "../TowerCard";

type ComponentProps = {
    filter: Filter;
};

const getFilteredTowers = async (filter: Filter): Promise<Tower[]> => {
    const towers: Tower[] = [];
    const q = query(
        collection(db, "towers"),
        where("name", ">=", filter.searchTerm),
        where("name", "<=", filter.searchTerm + "\uf8ff"),
        orderBy("name"),
        limit(20)
    );
    const snap = await getDocs(q);
    snap.forEach((doc) => {
        towers.push(normalizeTowerObject(doc.data() as TowerFirebase));
    });
    return towers;
};

async function Results({ filter }: ComponentProps) {
    const towers: Tower[] = await getFilteredTowers(filter);

    return (
        <div className="flex w-[1200px]">
            {towers.map((item, idx) => (
                <TowerCard key={idx} tower={item} />
            ))}
        </div>
    );
}

export default Results;
