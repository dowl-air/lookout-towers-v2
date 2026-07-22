import { Rating } from "@/types/Rating";
import { Tower } from "@/types/Tower";
import { Visit } from "@/types/Visit";
import { getVisitNumber } from "@/utils/visitPagination";

import ProfileVisitCard from "./ProfileVisitCard";

function ProfileVisits({
    visits,
    towers,
    ratings,
    totalVisits,
    page,
}: {
    visits: Visit[];
    towers: Tower[];
    ratings: Rating[];
    totalVisits: number;
    page: number;
}) {
    return (
        <div className="w-full flex flex-col gap-4">
            {visits.map((visit, idx) => {
                const tower = towers.find((t) => t.id === visit.tower_id);
                const rating = ratings.find((r) => r.tower_id === visit.tower_id);

                return (
                    <ProfileVisitCard
                        visit={visit}
                        tower={tower}
                        rating={rating}
                        key={visit.user_id + visit.tower_id}
                        index={getVisitNumber({ totalVisits, page, index: idx })}
                    />
                );
            })}
        </div>
    );
}

export default ProfileVisits;
