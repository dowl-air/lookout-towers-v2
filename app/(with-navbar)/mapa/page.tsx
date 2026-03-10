import { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import { MapMain } from "@/components/shared/map/MainMap";
import { MapProvider } from "@/context/MapContext";
import { getAllTowersForMap } from "@/data/tower/towers-map";
import { getAllUserFavouritesIds } from "@/data/user/user-favourites";
import { getAllUserVisits } from "@/data/user/user-visits";

export const metadata: Metadata = {
    title: "Mapa",
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

    return (
        <div className="flex justify-center items-stretch grow h-[calc(100dvh-66px)] md:h-[calc(100dvh-69px)]">
            <MapProvider>
                <MapMain towers={towers} />
            </MapProvider>
        </div>
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
