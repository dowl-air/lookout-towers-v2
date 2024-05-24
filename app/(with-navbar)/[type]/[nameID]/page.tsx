import { db, storage } from "@/app/firebase";
import { Rating, Tower, TowerFirebase } from "@/typings";
import { normalizeTowerObject } from "@/utils/normalizeTowerObject";
import { collection, getDocs, query, where } from "firebase/firestore";
import { listAll, ref } from "firebase/storage";

import React from "react";
import Carousel from "./Carousel";
import HistoryText from "./HistoryText";
import MainInfo from "./MainInfo";
import Map from "./Map";
import Parameters from "./Parameters";
import OpeningHours from "./OpeningHours";
import Admission from "./Admission";
import MainInfoPhone from "./MainInfoPhone";
import RatingBox from "./RatingBox";
import OpeningHoursDialog from "@/components/tower/OpeningHoursDialog";
import { Metadata, ResolvingMetadata } from "next";

const URL = "https://firebasestorage.googleapis.com/v0/b/";
const BUCKET = "lookout-towers.appspot.com/";
const PATH = "o/towers";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { nameID: string } }): Promise<Metadata> {
    const nameID = params.nameID;
    // fetch data
    const tower: Tower = await getTowerObjectByNameID(nameID);

    return {
        title: tower.name,
        description: tower.history,
        keywords: ["rozhledna", "pozorovatelna", "věž", tower.type, tower.name, tower.province || "", tower.county || ""],
        openGraph: {
            title: `${tower.name} - Rozhlednový svět`,
            images: [`/img/towers/${tower.id}/${tower.id}_0.jpg`],
            description: tower.history,
            url: `https://rozhlednovysvet.cz/${tower.type}/${tower.nameID}`,
            siteName: "Rozhlednový svět",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `${tower.name} - Rozhlednový svět`,
            description: tower.history,
            images: [`/img/towers/${tower.id}/${tower.id}_0.jpg`],
        },
    };
}

type PageProps = {
    params: {
        type: string;
        nameID: string;
    };
};

const getTowerObjectByNameID = async (name_id: string): Promise<Tower> => {
    const q = query(collection(db, "towers"), where("nameID", "==", name_id));
    const snap = await getDocs(q);
    let obj: {} = {};
    snap.forEach((doc) => {
        obj = doc.data();
    });
    return normalizeTowerObject(obj as TowerFirebase);
};

const getUrlsOfGalleryImages = async (id: string): Promise<string[]> => {
    const list = await listAll(ref(storage, "towers/" + id));
    return list.items.map((item) => `${URL}${BUCKET}${PATH}%2F${id}%2F${item.name}?alt=media`);
};

const getTowerRating = async (id: string): Promise<{ ratings: Rating[]; count: number; average: number }> => {
    const q = query(collection(db, "ratings"), where("tower_id", "==", id));
    const querySnapshot = await getDocs(q);
    const ratings: Rating[] = [];
    querySnapshot.forEach((doc) => {
        const obj: any = doc.data();
        obj.created = obj.created.toDate();
        obj.id = doc.id;
        ratings.push(obj as Rating);
    });
    const numbers = ratings.map((r) => r.rating);
    return {
        count: ratings.length,
        average: ratings.length ? numbers.reduce((a, b) => a + b) / ratings.length : 0,
        ratings: ratings,
    };
};

async function TowerPage({ params: { type, nameID } }: PageProps) {
    const tower = await getTowerObjectByNameID(nameID);
    const [towerImages, towerRating] = await Promise.all([getUrlsOfGalleryImages(tower.id), getTowerRating(tower.id)]);
    const { count, ratings, average } = towerRating;
    return (
        <div className="flex flex-col">
            <div id={"top"} className={"flex mb-8 flex-1"}>
                <div id={"top-content"} className={"max-w-screen-xl hidden lg:flex flex-col lg:justify-between lg:flex-row mx-auto"}>
                    <MainInfo tower={tower} average={average} count={count} />
                    <Carousel images={towerImages} />
                </div>
                <MainInfoPhone tower={tower} images={towerImages} average={average} count={count} />
            </div>
            <div
                id={"bottom"}
                className={"flex flex-col gap-6 items-center justify-center self-center mb-6 mx-1 sm:mx-3 flex-1 max-w-screen-xl w-full"}
            >
                <div className={"flex flex-wrap gap-3 w-full items-center justify-center"}>
                    <OpeningHours tower={tower}>
                        <OpeningHoursDialog tower={tower} />
                    </OpeningHours>
                    <Admission />
                    <Parameters {...tower} />
                </div>
                {tower.history && <HistoryText text={tower.history || ""} />}

                <RatingBox tower={tower} count={count} average={average} reviews={ratings} data-superjson />

                <Map lat={tower.gps.latitude} long={tower.gps.longitude} name={tower.name} />
            </div>
        </div>
    );
}

export default TowerPage;
