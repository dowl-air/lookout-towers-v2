import { Metadata } from "next";

import { getAllUserFavouritesIds } from "@/actions/favourites/favourites.action";
import { getAllTowers } from "@/actions/towers/towers.action";
import Map from "./Map";
import { getAllUserVisits } from "@/actions/visits/visits.action";

export const metadata: Metadata = {
    title: "Mapa",
};

// every 1 hour new towers
export const revalidate = 3600;

async function MapPage() {
    const towers = await getAllTowers();
    const favouriteTowersIds = await getAllUserFavouritesIds();
    const visits = await getAllUserVisits();
    towers.forEach((tower) => {
        tower.isFavourite = favouriteTowersIds.includes(tower.id);
        tower.isVisited = visits.some((visit) => visit.tower_id === tower.id);
    });
    return (
        <div className="flex justify-center items-stretch flex-grow h-[calc(100vh-66px)] md:h-[calc(100vh-70px)]">
            <Map lat={49.8237572} long={15.6086383} name="Rozhlednový svět" towers={towers} />
        </div>
    );
}

export default MapPage;
