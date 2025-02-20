import { getAllUserFavouritesIds } from "@/actions/favourites/favourites.action";
import { getAllUserRatings } from "@/actions/ratings/ratings.action";
import { getTowersByIDs } from "@/actions/towers/towers.action";
import { getAllUserVisits } from "@/actions/visits/visits.action";
import ProfileVisits from "@/components/profile/ProfileVisits";
import VisitsStats from "@/components/profile/visit-card/VisitsStats";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Navštívené rozhledny",
};

const VisitedTowersPage = async () => {
    const promises = [getAllUserFavouritesIds(), getAllUserVisits(), getAllUserRatings()];
    const [favouritesIds, visits, ratings] = await Promise.all(promises);
    const towerIds = [...favouritesIds, ...visits.map((visit) => visit.tower_id), ...ratings.map((rating) => rating.tower_id)];
    const uniqueTowerIds = Array.from(new Set(towerIds));
    const towers = await getTowersByIDs(uniqueTowerIds);

    return (
        <div className="flex flex-col my-8 gap-5 max-w-[calc(min(99dvw,80rem))] px-3 xl:px-0 m-auto">
            <article className="prose max-w-max px-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl">Moje navštívené rozhledny</h1>
                <p className="text-sm sm:text-base lg:text-lg">
                    Zde najdete seznam všech rozhleden, které jste navštívili. Pokud jste nějakou rozhlednu navštívili, ale není zde uvedena, můžete
                    si návštěvu přidat na stránce dané rozhledny.
                </p>
            </article>
            <VisitsStats visits={visits} towers={towers} />
            <ProfileVisits visits={visits} towers={towers} ratings={ratings} />
        </div>
    );
};

export default VisitedTowersPage;
