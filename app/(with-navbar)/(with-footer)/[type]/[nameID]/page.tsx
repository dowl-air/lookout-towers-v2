import { Metadata } from "next";

import HistoryText from "@/components/tower/tiles/HistoryText";
import Map from "@/components/tower/tiles/Map";
import Parameters from "@/components/tower/tiles/parameters/Parameters";
import OpeningHours from "@/components/tower/tiles/openingHours/OpeningHours";
import Admission from "@/components/tower/tiles/Admission";
import OpeningHoursDialog from "@/components/tower/tiles/openingHours/OpeningHoursDialog";
import { getTowerObjectByNameID, getTowerRatingAndCount } from "@/actions/towers/towers.action";
import { getUrlsTowerGallery } from "@/actions/towers/tower.photo";
import LocationBreadcrumbs from "@/components/tower/top/LocationBreadcrumbs";
import Legend from "@/components/tower/top/Legend";
import RatingTop from "@/components/tower/top/RatingTop";
import Buttons from "@/components/tower/top/Buttons";
import RatingFormProvider from "@/components/tower/rating/RatingProvider";
import Carousel from "@/components/tower/top/Carousel";
import { notFound } from "next/navigation";
import ChangesHistory from "@/components/tower/tiles/ChangesHistory";

async function TowerPage({ params: { nameID } }: { params: { nameID: string } }) {
    const tower = await getTowerObjectByNameID(nameID);
    if (!tower) notFound();
    const [towerImages, { count, avg }] = await Promise.all([getUrlsTowerGallery(tower.id), getTowerRatingAndCount(tower.id)]);

    return (
        <div className="flex flex-col px-4 w-full">
            <div className="max-w-screen-xl w-full flex flex-col items-center lg:items-start lg:justify-between lg:flex-row mx-auto">
                <div className="w-full prose sm:prose-xl max-w-screen-sm flex flex-col items-center lg:items-start flex-1 mt-7 lg:pl-2">
                    <LocationBreadcrumbs tower={tower} />
                    <h1 className="mt-5 lg:mt-6 lg:mb-8 lg:ml-1">{tower.name}</h1>
                    <Legend tower={tower} />
                    <RatingTop count={count} average={avg} />
                    <Buttons tower={tower} />
                </div>
                <Carousel images={towerImages} tower={tower} />
            </div>

            <div className="flex flex-col gap-6 items-center justify-center self-center mx-1 sm:mx-3 flex-1 max-w-screen-xl w-full">
                <div className="flex flex-wrap gap-3 w-full items-center justify-center">
                    <OpeningHours tower={tower}>
                        <OpeningHoursDialog tower={tower} />
                    </OpeningHours>
                    <Admission />
                    <Parameters tower={tower} />
                </div>
                {tower.history && <HistoryText text={tower.history} />}
                <RatingFormProvider tower={tower} />
                <Map lat={tower.gps.latitude} long={tower.gps.longitude} name={tower.name} />
                <ChangesHistory tower={tower} />
            </div>
        </div>
    );
}

export default TowerPage;

export async function generateMetadata({ params }: { params: { nameID: string } }): Promise<Metadata> {
    const tower = await getTowerObjectByNameID(params.nameID);

    if (!tower) {
        return {
            title: "Rozhledna nebyla nalezena",
            description: "Rozhledna nebyla nalezena",
            keywords: ["rozhledna", "pozorovatelna", "věž"],
            openGraph: {
                title: "Rozhledna nebyla nalezena",
                description: "Rozhledna nebyla nalezena",
                url: `https://rozhlednovysvet.cz/rozhledny`,
                siteName: "Rozhlednový svět",
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: "Rozhledna nebyla nalezena",
                description: "Rozhledna nebyla nalezena",
            },
        };
    }

    return {
        title: tower.name,
        description: tower.history,
        keywords: ["rozhledna", "pozorovatelna", "věž", tower.type, tower.name, tower.province, tower.county],
        openGraph: {
            title: `${tower.name} | Rozhlednový svět`,
            images: [
                {
                    url: tower.mainPhotoUrl,
                    alt: tower.name,
                },
            ],
            description: tower.history,
            url: `https://rozhlednovysvet.cz/${tower.type}/${tower.nameID}`,
            siteName: "Rozhlednový svět",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `${tower.name} | Rozhlednový svět`,
            description: tower.history,
            images: [
                {
                    url: tower.mainPhotoUrl,
                    alt: tower.name,
                },
            ],
        },
    };
}
