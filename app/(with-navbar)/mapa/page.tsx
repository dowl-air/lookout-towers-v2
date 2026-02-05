import { Metadata } from "next";

import { getAllUserFavouritesIds } from "@/actions/favourites/favourites.action";
import { getAllUserVisits } from "@/actions/visits/visits.action";
import { MapMain } from "@/components/shared/map/MainMap";
import { MapProvider } from "@/context/MapContext";
import { getAllTowersForMap } from "@/data/tower/towers-map";

export const metadata: Metadata = {
    title: "Mapa",
};

async function MapPage() {
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

export default MapPage;
