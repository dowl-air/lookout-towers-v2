import { getChangesByTower } from "@/actions/changes/change.get";
import { getUser } from "@/actions/members/members.action";
import { getTowerVisits } from "@/actions/visits/visits.action";
import ChangeLine from "@/components/tower/tiles/changesHistory/ChangeLine";
import VisitLine from "@/components/tower/tiles/changesHistory/VisitLine";
import { Change } from "@/types/Change";
import { Tower } from "@/types/Tower";
import { Visit } from "@/types/Visit";

const ChangesHistory = async ({ tower }: { tower: Tower }) => {
    const [towerChanges, towerVisits] = await Promise.all([getChangesByTower(tower.id, "", 50), getTowerVisits(tower.id)]); //todo? implement pagination
    const uniqueUserIDs = [...new Set([...towerChanges.map((change) => change.user_id), ...towerVisits.map((visit) => visit.user_id)])];
    const users = await Promise.all(uniqueUserIDs.map((id) => getUser(id)));

    //todo add different types of changes (admission...)

    if (towerChanges.length === 0 && towerVisits.length === 0) return null;

    const data: (Change | Visit)[] = [...towerChanges, ...towerVisits].sort((a, b) => {
        const dateA = "date" in a ? new Date(a.date).getTime() : new Date(a.created).getTime();
        const dateB = "date" in b ? new Date(b.date).getTime() : new Date(b.created).getTime();
        return dateB - dateA;
    });

    return (
        <div className="card card-compact sm:card-normal shadow-xl w-full mb-5">
            <div className="card-body gap-0">
                <h2 className="card-title text-base sm:text-lg md:text-xl text-nowrap">Historie změn a návštěv</h2>
                <div className="overflow-x-auto flex flex-col gap-1 max-h-96 overflow-y-auto">
                    {data.map((object, idx) => {
                        const user = users.find((user) => user.id === object.user_id);
                        if ("date" in object) {
                            return <VisitLine key={idx} visit={object} idx={idx} user={user} />;
                        } else if ("field" in object) {
                            return <ChangeLine key={idx} change={object} idx={idx} user={user} />;
                        }
                        return null;
                    })}
                </div>
            </div>
        </div>
    );
};

export default ChangesHistory;
