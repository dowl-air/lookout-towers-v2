import { getAllUserRatings } from "@/data/rating/ratings";
import { getTowersByIDs } from "@/data/tower/towers";
import { getAllUserFavouritesIds } from "@/data/user/user-favourites";
import { getAllUserVisits } from "@/data/user/user-visits";
import ProfileVisits from "@/components/profile/ProfileVisits";
import VisitsStats from "@/components/profile/visit-card/VisitsStats";
import { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Navštívené rozhledny",
};

const VisitedTowersContent = async () => {
    await connection();

    const [favouritesIds, visits, ratings] = await Promise.all([
        getAllUserFavouritesIds(),
        getAllUserVisits(),
        getAllUserRatings(),
    ]);
    const towerIds = [
        ...favouritesIds,
        ...visits.map((visit) => visit.tower_id),
        ...ratings.map((rating) => rating.tower_id),
    ];
    const uniqueTowerIds = Array.from(new Set(towerIds));
    const towers = await getTowersByIDs(uniqueTowerIds);

    return (
        <div className="flex flex-col my-8 gap-5 max-w-[calc(min(99dvw,80rem))] px-3 xl:px-0 m-auto">
            <article className="prose max-w-max px-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl">Moje navštívené rozhledny</h1>
                <p className="text-sm sm:text-base lg:text-lg">
                    Zde najdete seznam všech rozhleden, které jste navštívili. Pokud jste nějakou
                    rozhlednu navštívili, ale není zde uvedena, můžete si návštěvu přidat na stránce
                    dané rozhledny.
                </p>
            </article>
            <VisitsStats visits={visits} towers={towers} />
            <ProfileVisits visits={visits} towers={towers} ratings={ratings} />
        </div>
    );
};

const VisitedTowersPage = () => {
    return (
        <Suspense
            fallback={
                <div className="flex flex-col my-8 gap-5 max-w-[calc(min(99dvw,80rem))] px-3 xl:px-0 m-auto" />
            }
        >
            <VisitedTowersContent />
        </Suspense>
    );
};

export default VisitedTowersPage;
