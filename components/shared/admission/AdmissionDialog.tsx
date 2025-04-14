import { createChange } from "@/actions/changes/change.create";
import { ADMISSION_TARIFF_TYPES, ADMISSION_TYPES } from "@/constants/admission";
import { getTowerType4 } from "@/constants/towerType";
import { AdmissionType } from "@/types/Admission";
import { Tower } from "@/types/Tower";
import { cn } from "@/utils/cn";
import { getCurrency } from "@/utils/currency";
import { useState } from "react";

const AdmissionDialog = ({ tower, setNewTower = undefined }: { tower: Tower; setNewTower?: (t: Tower) => void }) => {
    const [type, setType] = useState(tower?.admission?.type || "unknown");
    const [tariffes, setTariffes] = useState(tower?.admission?.tariffes || {});
    const [isLoading, setIsLoading] = useState(false);

    if (!tower) return null;

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setType(event.target.value);
    };

    const handleTariffChange = (name: string, value: number) => {
        setTariffes((prevTariffes) => ({
            ...prevTariffes,
            [name]: {
                ...prevTariffes[name],
                price: value,
            },
        }));
    };

    const handleSubmit = async () => {
        if (setNewTower) {
            setNewTower({
                ...tower,
                admission: {
                    type: type as AdmissionType,
                    tariffes: {
                        ...tariffes,
                    },
                },
            });
        } else {
            setIsLoading(true);
            await createChange({
                type: "object",
                tower_id: tower.id,
                field: "admission",
                old_value: tower.admission,
                new_value: {
                    type: type as AdmissionType,
                    tariffes: {
                        ...tariffes,
                    },
                },
            });
            setIsLoading(false);
            const dialog = document.getElementById("admission_modal") as HTMLDialogElement;
            dialog.close();
        }
    };

    return (
        <dialog id="admission_modal" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-lg">
                    Změna vstupného {getTowerType4(tower.type)} {tower.name}
                </h3>
                <p className="mt-4">
                    Zde můžete upravit typ a cenu vstupného. Hodnoty, které nejsou relevantní, ponechce nevyplněné nebo vyplňte nulu.
                </p>
                <p className="my-2">
                    Ceny jsou pro tuto oblast ve měně <span className="font-bold">{getCurrency(tower.country).code}</span>.
                </p>
                <form className="mb-4">
                    <div className="form-control w-full mt-5">
                        <label className="label">
                            <span className="label-text">Typ vstupného</span>
                        </label>
                        <select
                            className={cn("select w-full select-bordered mt-2 text-lg", {
                                "select-warning": type === AdmissionType.PAID,
                                "select-success": type === AdmissionType.FREE || type === AdmissionType.DONATION,
                            })}
                            value={type}
                            onChange={handleTypeChange}
                        >
                            {ADMISSION_TYPES.map(({ label, value }) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>
                    {type === AdmissionType.PAID ? (
                        <div className="form-control w-full mt-4">
                            <div className="grid grid-cols-2 gap-x-3">
                                {ADMISSION_TARIFF_TYPES.map(({ label, value }) => (
                                    <div key={value} className="form-control w-full max-w-xs">
                                        <label className="label">
                                            <span className="label-text">{label}</span>
                                        </label>
                                        <input
                                            type="number"
                                            name={value}
                                            value={tariffes[value]?.price || ""}
                                            onChange={(e) => handleTariffChange(value, parseFloat(e.target.value))}
                                            className={cn("input input-bordered input-sm w-full max-w-xs", {
                                                "input-success": tariffes[value]?.price > 0,
                                            })}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </form>
                <div className="modal-action justify-between">
                    <form method="dialog">
                        <button className="btn btn-error">Zavřít</button>
                    </form>
                    <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                        {!isLoading ? "Uložit změny" : <span className="loading loading-spinner"></span>}
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default AdmissionDialog;
