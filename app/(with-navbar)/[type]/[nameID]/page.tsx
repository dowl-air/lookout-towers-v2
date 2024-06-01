import { Metadata } from "next";

import RatingBox from "./RatingBox";
import Carousel from "./Carousel";

import HistoryText from "@/components/tower/tiles/HistoryText";
import Map from "@/components/tower/tiles/Map";
import Parameters from "@/components/tower/tiles/parameters/Parameters";
import OpeningHours from "@/components/tower/tiles/openingHours/OpeningHours";
import Admission from "@/components/tower/tiles/Admission";
import OpeningHoursDialog from "@/components/tower/tiles/openingHours/OpeningHoursDialog";
import { getTowerObjectByNameID, getTowerRatingAndCount } from "@/actions/towers/towers.action";
import { getUrlsTowerGallery } from "@/actions/towers/tower.photo";
import { Tower } from "@/typings";
import LocationBreadcrumbs from "@/components/tower/top/LocationBreadcrumbs";
import Legend from "@/components/tower/top/Legend";
import RatingTop from "@/components/tower/top/RatingTop";
import Buttons from "@/components/tower/top/Buttons";

export const revalidate = 3600;

async function TowerPage({ params: { nameID } }: { params: { nameID: string } }) {
    const tower = await getTowerObjectByNameID(nameID);
    const [towerImages, towerRating] = await Promise.all([getUrlsTowerGallery(tower.id), getTowerRatingAndCount(tower.id)]);
    const { count, avg } = towerRating;

    return (
        <div className="flex flex-col">
            <div className="flex mb-8 flex-1">
                <div className="max-w-screen-xl flex flex-col lg:justify-between lg:flex-row mx-auto">
                    <div className="prose sm:prose-xl max-w-screen-sm flex flex-col items-center lg:items-start flex-1 pl-4 mt-7">
                        <LocationBreadcrumbs tower={tower} />
                        <h1>{tower.name}</h1>
                        <Legend tower={tower} />
                        <div className="lg:hidden flex">
                            <Carousel images={towerImages} phone />
                        </div>
                        <RatingTop count={count} average={avg} />
                        <Buttons tower={tower} />
                    </div>
                    <div className="hidden lg:flex">
                        <Carousel images={towerImages} />
                    </div>
                </div>
            </div>

            <div className={"flex flex-col gap-6 items-center justify-center self-center mb-6 mx-1 sm:mx-3 flex-1 max-w-screen-xl w-full"}>
                <div className={"flex flex-wrap gap-3 w-full items-center justify-center"}>
                    <OpeningHours tower={tower}>
                        <OpeningHoursDialog tower={tower} />
                    </OpeningHours>
                    <Admission />
                    <Parameters {...tower} />
                </div>
                {tower.history && <HistoryText text={tower.history} />}
                <RatingBox tower={tower} count={count} average={avg} reviews={[]} />
                <Map lat={tower.gps.latitude} long={tower.gps.longitude} name={tower.name} />
            </div>
        </div>
    );
}

export default TowerPage;

export async function generateMetadata({ params }: { params: { nameID: string } }): Promise<Metadata> {
    const tower: Tower = await getTowerObjectByNameID(params.nameID);
    return {
        title: tower.name,
        description: tower.history,
        keywords: ["rozhledna", "pozorovatelna", "věž", tower.type, tower.name, tower.province || "", tower.county || ""],
        openGraph: {
            title: `${tower.name} | Rozhlednový svět`,
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
