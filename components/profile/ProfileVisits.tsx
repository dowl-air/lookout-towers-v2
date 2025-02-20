import { Visit } from "@/types/Visit";
import ProfileVisitCard from "./ProfileVisitCard";
import { Tower } from "@/types/Tower";
import { Rating } from "@/types/Rating";

function ProfileVisits({ visits, towers, ratings }: { visits: Visit[]; towers: Tower[]; ratings: Rating[] }) {
    return (
        <div className="w-full flex flex-col gap-4">
            {visits.map((visit, idx) => {
                const tower = towers.find((t) => t.id === visit.tower_id);
                const rating = ratings.find((r) => r.tower_id === visit.tower_id);

                return (
                    <ProfileVisitCard visit={visit} tower={tower} rating={rating} key={visit.user_id + visit.tower_id} index={visits.length - idx} />
                );
            })}
        </div>
    );
}

export default ProfileVisits;
