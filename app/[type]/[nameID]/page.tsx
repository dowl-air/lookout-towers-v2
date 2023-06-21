import { db, storage } from "@/app/firebase";
import { Tower, TowerFirebase } from "@/typings";
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
import Navbar from "@/app/Navbar";
import MainInfoPhone from "./MainInfoPhone";
import RatingStats from "./RatingStats";
import OneReview from "./OneReview";

const URL = "https://firebasestorage.googleapis.com/v0/b/";
const BUCKET = "lookout-towers.appspot.com/";
const PATH = "o/towers";

export const revalidate = 3600;

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

async function TowerPage({ params: { type, nameID } }: PageProps) {
    const tower = await getTowerObjectByNameID(nameID);
    const towerImages = await getUrlsOfGalleryImages(tower.id);

    return (
        <div className="flex flex-col">
            <Navbar />
            <div id={"top"} className={"flex mb-8 flex-1"}>
                <div id={"top-content"} className={"max-w-screen-xl hidden lg:flex flex-col lg:justify-between lg:flex-row mx-auto"}>
                    <MainInfo tower={tower} />
                    <Carousel images={towerImages} />
                </div>
                <MainInfoPhone tower={tower} images={towerImages} />
            </div>
            <div id={"bottom"} className={"flex flex-col gap-12 items-center justify-center self-center mb-6 mx-3 flex-1 max-w-screen-xl"}>
                <div className={"flex flex-wrap gap-3 w-full items-center justify-center"}>
                    <OpeningHours />
                    <Admission />
                    <Parameters {...tower} />
                </div>
                {tower.history && <HistoryText text={tower.history || ""} />}

                <div id="rating_box" className="card flex flex-col justify-center gap-6 w-full p-5 sm:p-8 shadow-xl border border-secondary-focus">
                    <div id="rating_box_top" className="flex justify-between items-center w-full">
                        <h2 className="card-title text-base sm:text-xl">Recenze [3]</h2>
                        <button className="btn btn-primary btn-sm sm:btn-md">Přidat recenzi</button>
                    </div>
                    <div id="rating_box_bottom" className="flex flex-wrap">
                        <div className="h-72 flex-col gap-6 overflow-auto min-w-[320px] flex-1">
                            <OneReview />
                            <OneReview />
                            <OneReview />
                        </div>
                        <div className="divider w-full md:w-4 md:divider-horizontal"></div>
                        <RatingStats />
                    </div>
                </div>

                <Map lat={tower.gps.latitude} long={tower.gps.longitude} name={tower.name} />
            </div>
        </div>
    );
}

export default TowerPage;
