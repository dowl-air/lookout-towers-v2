import { Visit } from "@/types/Visit";
import ProfileVisitCard from "./ProfileVisitCard";
import { Tower } from "@/types/Tower";
import { Rating } from "@/types/Rating";

function ProfileVisits({ visits, towers, ratings }: { visits: Visit[]; towers: Tower[]; ratings: Rating[] }) {
    const groupedVisits = visits.reduce((acc: Record<string, Visit[]>, visit) => {
        const dateKey = new Date(visit.date).toLocaleDateString("en");
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(visit);
        return acc;
    }, {});

    const sortedDates = Object.keys(groupedVisits).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    return (
        <div className="w-full">
            {sortedDates.map((date) => (
                <div key={date} className="mb-10 flex flex-col items-center">
                    <h2 className="text-3xl font-bold mb-4 text-base-content">
                        {new Date(groupedVisits[date][0].date).toLocaleDateString("cs", { dateStyle: "long" })}
                    </h2>
                    <ul className="flex gap-x-4 gap-y-2 flex-wrap justify-center">
                        {groupedVisits[date]
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map((visit, idx) => {
                                const tower = towers.find((t) => t.id === visit.tower_id);
                                const rating = ratings.find((r) => r.tower_id === visit.tower_id);
                                return (
                                    <li key={idx} className="mb-6">
                                        <ProfileVisitCard visit={visit} tower={tower} rating={rating} />
                                    </li>
                                );
                            })}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default ProfileVisits;
