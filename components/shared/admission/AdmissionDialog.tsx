"use client";

import { useState } from "react";

import { createChange } from "@/actions/changes/change.create";
import { ADMISSION_TARIFF_TYPES, ADMISSION_TYPES } from "@/constants/admission";
import { getTowerType4 } from "@/constants/towerType";
import { AdmissionType } from "@/types/Admission";
import { Tower } from "@/types/Tower";
import { cn } from "@/utils/cn";
import { getCurrency } from "@/utils/currency";
import Dialog from "@/components/shared/dialog/Dialog";
import { closeModal } from "@/utils/showModal";

const DIALOG_NAME = "admission_modal";

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
            closeModal(DIALOG_NAME);
        }
    };

    return (
        <Dialog
            id={DIALOG_NAME}
            title={`Změna vstupného ${getTowerType4(tower.type)} ${tower.name}`}
            actions={[
                {
                    label: !isLoading ? "Uložit změny" : <span className="loading loading-spinner"></span>,
                    action: handleSubmit,
                    customClass: "btn-primary",
                },
            ]}
        >
            <p className="mt-4">Zde můžete upravit typ a cenu vstupného. Hodnoty, které nejsou relevantní, ponechce nevyplněné nebo vyplňte nulu.</p>
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
        </Dialog>
    );
};

export default AdmissionDialog;
