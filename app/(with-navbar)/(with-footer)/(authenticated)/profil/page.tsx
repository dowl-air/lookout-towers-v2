import ProfileBox from "./ProfileBox";
import { getAllUserFavouritesIds } from "@/actions/favourites/favourites.action";
import { getAllUserVisits } from "@/actions/visits/visits.action";
import { getAllUserRatings } from "@/actions/ratings/ratings.action";
import { getTowersByIDs } from "@/actions/towers/towers.action";
import ProfileMapFixed from "@/components/shared/map/ProfileMapFixed";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Profil",
};

async function ProfilePage() {
    const promises = [getAllUserFavouritesIds(), getAllUserVisits(), getAllUserRatings()];
    const [favouritesIds, visits, ratings] = await Promise.all(promises);
    const towerIds = [...favouritesIds, ...visits.map((visit) => visit.tower_id), ...ratings.map((rating) => rating.tower_id)];
    const uniqueTowerIds = Array.from(new Set(towerIds));
    const towers = await getTowersByIDs(uniqueTowerIds);

    return (
        <div className="flex flex-col items-center gap-3 mt-3 max-w-[calc(min(99vw,80rem))] m-auto">
            <div className="flex w-full items-center sm:items-start justify-center flex-col sm:flex-row sm:h-[687px] gap-3">
                <ProfileBox score={visits.length} changes={0} favs={favouritesIds.length} ratings={ratings.length} visits={visits.length} />
                <div className="flex h-[250px] w-[97vw] flex-grow sm:h-full">
                    <ProfileMapFixed towers={towers} visits={visits} favourites={favouritesIds} />
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
