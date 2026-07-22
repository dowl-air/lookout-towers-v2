import { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import { MapMain } from "@/components/shared/map/MainMap";
import { MapProvider } from "@/context/MapContext";
import { getAllTowersForMap } from "@/data/tower/towers-map";
import { getAllUserFavouritesIds } from "@/data/user/user-favourites";
import { getAllUserVisits } from "@/data/user/user-visits";
import { SITE_URL } from "@/utils/constants";
import { getMapJsonLd } from "@/utils/structuredData";

const MAP_TITLE = "Mapa rozhleden a vyhlídek";
const MAP_DESCRIPTION =
    "Objevujte rozhledny, vyhlídky a věže na interaktivní mapě Česka. Najděte místa s výhledem ve svém okolí a naplánujte výlet.";
const MAP_URL = `${SITE_URL}/mapa`;
const MAP_SHARE_IMAGE_ALT = "Mapa rozhleden a vyhlídek po Česku";

export const metadata: Metadata = {
    title: MAP_TITLE,
    description: MAP_DESCRIPTION,
    alternates: {
        canonical: MAP_URL,
    },
    openGraph: {
        title: `${MAP_TITLE} | Rozhlednový svět`,
        description: MAP_DESCRIPTION,
        url: MAP_URL,
        siteName: "Rozhlednový svět",
        type: "website",
        images: [
            {
                url: "/opengraph-image",
                width: 1200,
                height: 630,
                alt: MAP_SHARE_IMAGE_ALT,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: `${MAP_TITLE} | Rozhlednový svět`,
        description: MAP_DESCRIPTION,
        images: [
            {
                url: "/twitter-image",
                alt: MAP_SHARE_IMAGE_ALT,
            },
        ],
    },
};

async function MapContent() {
    await connection();

    const [towers, favouriteTowersIds, visits] = await Promise.all([
        getAllTowersForMap(),
        getAllUserFavouritesIds(),
        getAllUserVisits(),
    ]);

    for (const tower of towers) {
        tower.isFavourite = favouriteTowersIds.includes(tower.id);
        tower.isVisited = visits.some((v) => v.tower_id === tower.id);
    }
    const mapJsonLd = getMapJsonLd({
        url: MAP_URL,
        name: MAP_TITLE,
        description: MAP_DESCRIPTION,
        towerCount: towers.length,
    });

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(mapJsonLd) }}
            />
            <div className="flex justify-center items-stretch grow h-[calc(100dvh-66px)] md:h-[calc(100dvh-69px)]">
                <MapProvider>
                    <MapMain towers={towers} />
                </MapProvider>
            </div>
        </>
    );
}

function MapPage() {
    return (
        <Suspense
            fallback={
                <div className="flex justify-center items-stretch grow h-[calc(100dvh-66px)] md:h-[calc(100dvh-69px)]" />
            }
        >
            <MapContent />
        </Suspense>
    );
}

export default MapPage;
