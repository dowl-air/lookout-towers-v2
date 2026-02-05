import { Metadata } from "next";

import { getAllUserFavouritesIds } from "@/actions/favourites/favourites.action";
import { getAllUserRatings } from "@/actions/ratings/ratings.action";
import { getTowersByIDs } from "@/actions/towers/towers.action";
import { getAllUserVisits } from "@/actions/visits/visits.action";
import { ProfileMap } from "@/components/shared/map/ProfileMap";
import { MapProvider } from "@/context/MapContext";
import { TowerMapDTO } from "@/data/tower/towers-map";

import ProfileBox from "./ProfileBox";

export const metadata: Metadata = {
    title: "Profil",
};

async function ProfilePage() {
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
        <div className="flex flex-col items-center gap-3 mt-3 max-w-[calc(min(99vw,80rem))] m-auto">
            <div className="flex w-full items-center sm:items-start justify-center flex-col sm:flex-row sm:h-[687px] gap-3">
                <ProfileBox
                    score={visits.length}
                    changes={0}
                    favs={favouritesIds.length}
                    ratings={ratings.length}
                    visits={visits.length}
                />
                <div className="flex h-[250px] w-[97vw] grow sm:h-full">
                    <MapProvider>
                        <ProfileMap towers={__towersDTO} />
                    </MapProvider>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
