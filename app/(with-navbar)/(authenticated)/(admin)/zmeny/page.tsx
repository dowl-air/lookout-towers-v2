import { getUnresolvedChanges } from "@/actions/changes/change.get";
import { getTowersByIDs } from "@/actions/towers/towers.action";
import ChangeValueAdmin from "@/app/(with-navbar)/(authenticated)/(admin)/zmeny/ChangeValueAdmin";
import ChangeButtons from "@/components/admin/ChangeButtons";
import { editableParameters } from "@/utils/editableParameters";
import Link from "next/link";

const ChangesAdmin = async () => {
    const changes = await getUnresolvedChanges();
    const towers = await getTowersByIDs(changes.map((change) => change.tower_id));
    return (
        <div className="min-h-screen">
            <div className="flex flex-col mt-12 gap-6 max-w-7xl w-full mx-auto">
                <h1 className="text-xl">Celkem navrhovaných změn: {changes.length}</h1>
                {changes.map((change) => {
                    const tower = towers.find((t) => t.id === change.tower_id);
                    let parameter = editableParameters.find((p) => p.name === change.field);
                    if (change.field === "openingHours") parameter = { label: "Otevírací doba", type: "object", name: "openingHours" };
                    if (change.field === "urls") parameter = { name: "urls", label: "Odkazy", type: "array" };
                    if (change.field === "admission") parameter = { name: "admission", label: "Vstupné", type: "object" };
                    return (
                        <div className="card bg-base-100 shadow-xl" key={change.id}>
                            <div className="card-body">
                                <h2 className="card-title">{tower.name}</h2>
                                <div className="flex gap-6 items-center flex-nowrap">
                                    <Link href={`/${tower.type}/${tower.nameID}`}>
                                        <div className="w-40 h-40">
                                            <img src={tower.mainPhotoUrl} alt={tower.name} className="w-full h-40 object-cover rounded-xl" />
                                        </div>
                                    </Link>
                                    <div className="font-bold text-lg">{parameter.label}</div>
                                    <div className="flex flex-col">
                                        <div className="text-error overflow-auto max-w-3xl">
                                            <ChangeValueAdmin type={parameter.type} value={change.old_value} />
                                        </div>
                                        <hr className="my-2" />
                                        <div className="text-success max-w-3xl">
                                            <ChangeValueAdmin type={parameter.type} value={change.new_value} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <ChangeButtons change={change} tower={tower} />
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
