import { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import ProfileBox from "@/app/(with-navbar)/(with-footer)/(authenticated)/profil/ProfileBox";
import { ProfileMap } from "@/components/shared/map/ProfileMap";
import { MapProvider } from "@/context/MapContext";
import { getAllUserRatings } from "@/data/rating/ratings";
import { getTowersByIDs } from "@/data/tower/towers";
import { TowerMapDTO } from "@/data/tower/towers-map";
import { getAllUserFavouritesIds } from "@/data/user/user-favourites";
import { getAllUserVisits } from "@/data/user/user-visits";

export const metadata: Metadata = {
    title: "Profil",
};

async function ProfileContent() {
    await connection();

    const [favouritesIds, visits, ratings] = await Promise.all([
        getAllUserFavouritesIds(),
        getAllUserVisits(),
        getAllUserRatings(),
    ]);

    const uniqueTowerIds = Array.from(
        new Set([
            ...favouritesIds,
            ...visits.map((visit) => visit.tower_id),
            ...ratings.map((rating) => rating.tower_id),
        ])
    );

    const towers = await getTowersByIDs(uniqueTowerIds);
    //todo fix proper DTO
    const __towersDTO: TowerMapDTO[] = towers.map((tower) => ({
        id: tower.id,
        name: tower.name,
        nameID: tower.nameID,
        type: tower.type,
        gps: tower.gps,
        opened: tower.opened,
        country: tower.country,
        province: tower.province,
        county: tower.county,
        openingHours: tower.openingHours,
        mainPhotoUrl: tower.mainPhotoUrl,
        isFavourite: favouritesIds.includes(tower.id),
        isVisited: visits.some((visit) => visit.tower_id === tower.id),
    }));

    return (
        <div className="mx-auto my-8 flex max-w-[calc(min(99dvw,80rem))] flex-col gap-5 px-3 xl:px-0">
            <article className="prose max-w-max px-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl">Můj profil</h1>
                <p className="text-sm sm:text-base">
                    Přehled vašich návštěv, oblíbených míst a hodnocení.
                </p>
            </article>
            <div className="grid w-full gap-5 lg:grid-cols-[17rem_minmax(0,1fr)]">
                <ProfileBox
                    score={visits.length}
                    changes={0}
                    favs={favouritesIds.length}
                    ratings={ratings.length}
                    visits={visits.length}
                />
                <div className="h-[360px] min-w-0 sm:h-[560px] lg:h-[687px]">
                    <MapProvider>
                        <ProfileMap towers={__towersDTO} />
                    </MapProvider>
                </div>
            </div>
        </div>
    );
}

function ProfilePage() {
    return (
        <Suspense
            fallback={
                <div className="flex flex-col items-center gap-3 mt-3 max-w-[calc(min(99vw,80rem))] m-auto" />
            }
        >
            <ProfileContent />
        </Suspense>
    );
}

export default ProfilePage;
