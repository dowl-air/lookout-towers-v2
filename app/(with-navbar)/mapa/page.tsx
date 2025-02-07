import { Metadata } from "next";
import { getAllUserFavouritesIds } from "@/actions/favourites/favourites.action";
import { getAllTowers } from "@/actions/towers/towers.action";
import { getAllUserVisits } from "@/actions/visits/visits.action";
import MainMapFixed from "@/components/shared/map/MainMapFixed";

export const metadata: Metadata = {
    title: "Mapa",
};

async function MapPage() {
    const [towers, favouriteTowersIds, visits] = await Promise.all([getAllTowers(), getAllUserFavouritesIds(), getAllUserVisits()]);

    return (
        <div className="flex justify-center items-stretch flex-grow h-[calc(100dvh-66px)] md:h-[calc(100dvh-69px)]">
            <MainMapFixed towers={towers} visits={visits} favourites={favouriteTowersIds} />
        </div>
    );
}

export default MapPage;
