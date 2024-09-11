import DynamicMap from "./DynamicMap";
import ProfileBox from "./ProfileBox";
import TabsAndContent from "./TabsAndContent";
import { getAllUserFavouritesIds } from "@/actions/favourites/favourites.action";
import { getAllUserVisits } from "@/actions/visits/visits.action";
import { getAllUserRatings } from "@/actions/ratings/ratings.action";
import { getTowersByIDs } from "@/actions/towers/towers.action";

async function ProfilePage() {
    const promises = [getAllUserFavouritesIds(), getAllUserVisits(), getAllUserRatings()];
    const [favouritesIds, visits, ratings] = await Promise.all(promises);
    const towerIds = [...favouritesIds, ...visits.map((visit) => visit.tower_id), ...ratings.map((rating) => rating.tower_id)];
    const towers = await getTowersByIDs(towerIds);

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="flex max-w-[calc(min(99vw,80rem))] w-full items-center sm:items-start justify-center flex-col sm:flex-row sm:h-[687px] gap-3">
                <ProfileBox score={visits.length} changes={0} favs={favouritesIds.length} ratings={ratings.length} visits={visits.length} />
                <div className="flex h-[170px] w-[97vw] flex-grow sm:h-full">
                    <DynamicMap lat={49.8237572} long={15.6086383} towers={towers} visits={visits.map((v) => v.tower_id)} favs={favouritesIds} />
                </div>
            </div>
            <TabsAndContent visits={visits} favs={favouritesIds} towers={towers} />
        </div>
    );
}

export default ProfilePage;
