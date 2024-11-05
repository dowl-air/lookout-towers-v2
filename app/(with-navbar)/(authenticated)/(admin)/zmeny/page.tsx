import { getUnresolvedChanges } from "@/actions/changes/change.get";
import { getTowersByIDs } from "@/actions/towers/towers.action";
import ChangeButtons from "@/components/admin/ChangeButtons";
import { editableParameters } from "@/utils/editableParameters";

const ChangesAdmin = async () => {
    const changes = await getUnresolvedChanges();
    const towers = await getTowersByIDs(changes.map((change) => change.tower_id));
    return (
        <div className="min-h-screen">
            <div className="flex flex-col mt-12 gap-6 max-w-4xl w-full mx-auto">
                <h1 className="text-xl">Celkem navrhovaných změn: {changes.length}</h1>
                {changes.map((change) => {
                    const tower = towers.find((t) => t.id === change.tower_id);
                    const parameter = editableParameters.find((p) => p.name === change.field);
                    return (
                        <div className="card bg-base-100 shadow-xl" key={change.id}>
                            <div className="card-body">
                                <h2 className="card-title">{tower.name}</h2>
                                <div className="flex gap-6 items-center justify-between">
                                    <div className="w-40 h-40 ">
                                        <img src={tower.mainPhotoUrl} alt={tower.name} className="w-full h-40 object-cover rounded-xl" />
                                    </div>
                                    <div className="font-bold text-lg">{parameter.label}</div>
                                    <div className="flex flex-col">
                                        <div className="text-error">{change.old_value}</div>
                                        <hr className="my-2" />
                                        <div className="text-success">{change.new_value}</div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <ChangeButtons change={change} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ChangesAdmin;
