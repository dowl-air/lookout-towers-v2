import { Metadata } from "next";
import { notFound } from "next/navigation";
import { TouristAttraction, WithContext } from "schema-dts";

import { listTowerPhotos } from "@/actions/photos/towerPhotos.list";
import { getUrlsTowerGallery } from "@/actions/towers/tower.photo";
import { getTowerObjectByNameID, getTowerRatingAndCount } from "@/actions/towers/towers.action";
import RatingFormProvider from "@/components/tower/rating/RatingProvider";
import Admission from "@/components/tower/tiles/Admission";
import ChangesHistory from "@/components/tower/tiles/ChangesHistory";
import HistoryText from "@/components/tower/tiles/HistoryText";
import MapTile from "@/components/tower/tiles/MapTile";
import OpeningHoursDialog from "@/components/tower/tiles/openingHours/OpeningHoursDialog";
import OpeningHours from "@/components/tower/tiles/openingHours/OpeningHoursTile";
import Parameters from "@/components/tower/tiles/parameters/Parameters";
import Sources from "@/components/tower/tiles/Sources";
import Buttons from "@/components/tower/top/Buttons";
import Carousel from "@/components/tower/top/Carousel";
import Legend from "@/components/tower/top/Legend";
import LocationBreadcrumbs from "@/components/tower/top/LocationBreadcrumbs";
import RatingTop from "@/components/tower/top/RatingTop";
import { MapProvider } from "@/context/MapContext";

async function TowerPage({ params }: { params }) {
    const { nameID } = await params;
    const tower = await getTowerObjectByNameID(nameID);
    if (!tower) notFound();
    const [towerImages, towerUserImages, { count, avg }] = await Promise.all([
        getUrlsTowerGallery(tower.id),
        listTowerPhotos(tower.id),
        getTowerRatingAndCount(tower.id),
    ]);

    // TODO? use LandmarksOrHistoricalBuildings when tower is historic monument
    // TODO add openinghours as openingHours schema
    // TODO add admission schema when admission is defined
    const jsonLd: WithContext<TouristAttraction> = {
        "@context": "https://schema.org",
        "@type": "TouristAttraction",
        "@id": `https://rozhlednovysvet.cz/${tower.type}/${tower.nameID}#schema`,
        url: `https://rozhlednovysvet.cz/${tower.type}/${tower.nameID}`,
        name: tower.name,
        description: tower.history,
        image: towerImages,
        address: {
            "@type": "PostalAddress",
            addressLocality: tower.county,
            addressRegion: tower.province,
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: tower.gps.latitude,
            longitude: tower.gps.longitude,
        },
        touristType: ["Sightseeing", "Hiking", "Photography"],
        sameAs: [
            tower.mapycz?.href,
            tower.gmaps?.url,
            tower.urls.find((url) => url.includes("wikipedia")),
        ].filter(Boolean),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="flex flex-col px-4 w-full">
                <div className="max-w-(--breakpoint-xl) w-full flex flex-col items-center lg:items-start lg:justify-between lg:flex-row mx-auto">
                    <div className="w-full prose sm:prose-xl max-w-(--breakpoint-sm) flex flex-col items-center lg:items-start flex-1 lg:pl-2 lg:mt-7">
                        <LocationBreadcrumbs tower={tower} />
                        <h1 className="mt-2 mb-2 lg:mt-6 lg:mb-8 lg:ml-1 text-center lg:text-left">
                            {tower.name}
                        </h1>
                        <Legend tower={tower} />
                        <RatingTop count={count} average={avg} />
                        <Buttons tower={tower} />
                    </div>
                    <Carousel images={towerImages} userImages={towerUserImages} tower={tower} />
                </div>

                <div className="flex flex-col gap-6 items-center justify-center self-center mx-1 sm:mx-3 flex-1 max-w-(--breakpoint-xl) w-full mb-6">
                    <div className="flex flex-wrap gap-3 w-full items-center justify-center">
                        <OpeningHours tower={tower}>
                            <OpeningHoursDialog tower={tower} />
                        </OpeningHours>
                        <Admission tower={tower} />
                        <Parameters tower={tower} />
                    </div>
                    {tower.history && <HistoryText text={tower.history} />}
                    <RatingFormProvider tower={tower} />
                    <MapProvider>
                        <MapTile tower={tower} />
                    </MapProvider>
                    <Sources tower={tower} />
                    <ChangesHistory tower={tower} />
                </div>
            </div>
        </>
    );
}

export default TowerPage;

export async function generateMetadata({ params }: { params }): Promise<Metadata> {
    const { nameID } = await params;
    const tower = await getTowerObjectByNameID(nameID);

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
        keywords: [
            "rozhledna",
            "pozorovatelna",
            "věž",
            tower.type,
            tower.name,
            tower.province,
            tower.county,
        ],
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
