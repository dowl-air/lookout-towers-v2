import { getTowersCount } from "@/actions/towers/tower.stats";
import { Tower } from "@/types/Tower";
import { Visit } from "@/types/Visit";
import { formatDateYear } from "@/utils/date";

const VisitsStats = async ({ visits, towers }: { visits: Visit[]; towers: Tower[] }) => {
    if (!visits || visits.length === 0)
        return (
            <div className="px-3 text-lg font-bold">
                Zde budou zobrazeny statistiky navštívených rozhleden. Přidejte si alespoň jednu rozhlednu mezi navštívené.
            </div>
        );

    const firstVisit = visits[visits.length - 1];

    const allTowersCount = await getTowersCount();

    const percentageOfVisitedTowers = ((visits.length / allTowersCount) * 100).toFixed(2);

    const towersInEachDay = visits.reduce((acc, visit) => {
        const date = new Date(visit.date).toLocaleDateString("cs");
        if (!acc[date]) acc[date] = 0;
        acc[date]++;
        return acc;
    }, {});

    // find the day with the most visits
    const maxVisitsDay = Object.keys(towersInEachDay).reduce((acc, day) => {
        if (towersInEachDay[day] > towersInEachDay[acc]) return day;
        return acc;
    });

    return (
        <div className="stats w-fit shadow-sm flex flex-wrap mb-5">
            <div className="stat w-44">
                <div className="stat-title">Celkem navštíveno</div>
                <div className="stat-value">{visits.length}</div>
                <div className="stat-desc">rozhleden</div>
            </div>
            <div className="stat w-44">
                <div className="stat-title">Celkem navštíveno</div>
                <div className="stat-value">{percentageOfVisitedTowers} %</div>
                <div className="stat-desc">známých rozhleden</div>
            </div>
            <div className="stat w-44">
                <div className="stat-title">První návštěva</div>
                <div className="stat-value">{formatDateYear({ date: firstVisit.date })}</div>
                <div className="stat-desc">{towers.find((t) => t.id === firstVisit.tower_id).name}</div>
            </div>
            <div className="stat w-44">
                <div className="stat-title">Nejvíce za den</div>
                <div className="stat-value">{towersInEachDay[maxVisitsDay]}</div>
                <div className="stat-desc">{maxVisitsDay}</div>
            </div>
        </div>
    );
};

export default VisitsStats;
