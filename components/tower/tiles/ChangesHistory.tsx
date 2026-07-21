import ChangeLine from "@/components/tower/tiles/changesHistory/ChangeLine";
import { getChangesByTower } from "@/data/change/changes";
import { getUserById } from "@/data/user/user";
import { Tower } from "@/types/Tower";

const ChangesHistory = async ({ tower }: { tower: Tower }) => {
    const towerChanges = await getChangesByTower(tower.id, "", 50); //todo? implement pagination
    if (towerChanges.length === 0) return null;

    const uniqueUserIDs = [...new Set(towerChanges.map((change) => change.user_id))];
    const users = await Promise.all(uniqueUserIDs.map((id) => getUserById(id)));

    return (
        <div className="card card-compact sm:card-normal shadow-xl w-full mb-5">
            <div className="card-body gap-0">
                <h2 className="card-title text-base sm:text-lg md:text-xl text-nowrap">
                    Historie změn
                </h2>
                <div className="overflow-x-auto flex flex-col gap-1 max-h-96 overflow-y-auto">
                    {towerChanges.map((change, idx) => {
                        const user = users.find((user) => user.id === change.user_id);
                        return <ChangeLine key={change.id} change={change} idx={idx} user={user} />;
                    })}
                </div>
            </div>
        </div>
    );
};

export default ChangesHistory;
