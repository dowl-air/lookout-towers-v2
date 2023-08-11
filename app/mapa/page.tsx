import React from "react";
import Map from "./Map";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Tower, TowerFirebase } from "@/typings";
import { normalizeTowerObject } from "@/utils/normalizeTowerObject";
import Navbar from "../Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mapa",
};

// every 1 hour new towers
export const revalidate = 3600;

const getAllTowers = async (): Promise<Tower[]> => {
    const towers: Tower[] = [];
    const querySnapshot = await getDocs(collection(db, "towers"));
    querySnapshot.forEach((doc) => {
        towers.push(normalizeTowerObject(doc.data() as TowerFirebase));
    });
    return towers;
};

async function MapPage() {
    const towers: Tower[] = await getAllTowers();
    return (
        <>
            <Navbar />
            <div className="flex justify-center items-stretch flex-grow h-[calc(100vh-70px-50px)] m-6">
                <Map lat={49.8237572} long={15.6086383} name="Rozhlednový svět" towers={towers} />
            </div>
        </>
    );
}

export default MapPage;
