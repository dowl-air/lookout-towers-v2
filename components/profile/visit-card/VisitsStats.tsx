import { getTotalTowersCount } from "@/data/tower/total-count";
import { getTowerByID } from "@/data/tower/towers";
import { UserVisitStats } from "@/data/user/user-visits";
import { formatDateYear } from "@/utils/date";

const VisitsStats = async ({ stats }: { stats: UserVisitStats }) => {
    if (stats.count === 0)
        return (
            <div className="px-3 text-lg font-bold">
                Zde budou zobrazeny statistiky navštívených rozhleden. Přidejte si alespoň jednu
                rozhlednu mezi navštívené.
            </div>
        );

    const [allTowersCount, firstVisitTower] = await Promise.all([
        getTotalTowersCount(),
        stats.firstVisit ? getTowerByID(stats.firstVisit.tower_id) : null,
    ]);

    const percentageOfVisitedTowers = ((stats.count / allTowersCount) * 100).toFixed(2);

    return (
        <div className="stats w-fit shadow-sm flex flex-wrap mb-5">
            <div className="stat w-44">
                <div className="stat-title">Celkem navštíveno</div>
                <div className="stat-value">{stats.count}</div>
                <div className="stat-desc">rozhleden</div>
            </div>
            <div className="stat w-44">
                <div className="stat-title">Celkem navštíveno</div>
                <div className="stat-value">{percentageOfVisitedTowers} %</div>
                <div className="stat-desc">známých rozhleden</div>
            </div>
            <div className="stat w-44">
                <div className="stat-title">Tento rok</div>
                <div className="stat-value">{stats.visitsThisYear}</div>
                <div className="stat-desc">navštívených rozhleden</div>
            </div>
            <div className="stat w-44">
                <div className="stat-title">Nejvíce za den</div>
                <div className="stat-value">{stats.mostVisitsDayCount}</div>
                <div className="stat-desc">{stats.mostVisitsDay}</div>
            </div>
            <div className="stat w-44">
                <div className="stat-title">Nejvíce za měsíc</div>
                <div className="stat-value">{stats.mostActiveMonthCount}</div>
                <div className="stat-desc">{stats.mostActiveMonth}</div>
            </div>
            <div className="stat w-44">
                <div className="stat-title">Nejdelší série</div>
                <div className="stat-value">{stats.longestStreak}</div>
                <div className="stat-desc">po sobě jdoucích dnů</div>
            </div>
            <div className="stat w-44">
                <div className="stat-title">První návštěva</div>
                <div className="stat-value">{formatDateYear({ date: stats.firstVisit?.date })}</div>
                <div className="stat-desc">{firstVisitTower?.name || "Neznámá rozhledna"}</div>
            </div>
        </div>
    );
};

export default VisitsStats;
