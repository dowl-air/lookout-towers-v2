"use client";

import Step1 from "@/components/tower/tiles/parameters/edit/Step1";
import Step2 from "@/components/tower/tiles/parameters/edit/Step2";
import Step3 from "@/components/tower/tiles/parameters/edit/Step3";
import { Tower } from "@/typings";
import { cn } from "@/utils/cn";
import { useEffect, useState } from "react";

const ParametersEditDialog = ({ tower }: { tower: Tower }) => {
    const [step, setStep] = useState(0);
    const [parameter, setParameter] = useState<keyof Tower | "default">("default");
    const [newValue, setNewValue] = useState<any>("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setNewValue(tower[parameter as keyof Tower]);
    }, [parameter]);

    const resetValues = () => {
        setStep(0);
        setParameter("default");
        setNewValue("");
    };

    const checkNewValue = (newValue: any) => {
        if (parameter === "default") {
            return "Zadejte novou hodnotu.";
        }
        if (newValue === tower[parameter as keyof Tower]) {
            return "Zadaná hodnota se musí lišit od stávající.";
        }
        return true;
    };

    return (
        <dialog id="edit_parameters" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-5 text-center">Úpravit parametry {tower.name}</h3>
                <ul className="steps w-full">
                    <li className="step step-primary">Zvolit parametr</li>
                    <li className={`step ${step >= 1 ? "step-primary" : ""}`}>Nová hodnota</li>
                    <li className={`step ${step >= 2 ? "step-primary" : ""}`}>Dokončení</li>
                </ul>

                <div className="h-60 flex flex-col items-center justify-center gap-5">
                    {step === 0 && <Step1 parameter={parameter} setParameter={setParameter} tower={tower} />}
                    {step === 1 && <Step2 newValue={newValue} setNewValue={setNewValue} parameter={parameter} tower={tower} />}
                    {step === 2 && <Step3 tower={tower} parameter={parameter} newValue={newValue} />}
                    {step === 3 && (
                        <div className="text-center">
                            <p className="text-lg font-bold mb-3">Děkujeme za návrh úpravy parametru.</p>
                            <p>Po schválení administrátorem bude změna provedena. Stav změny můžete sledovat na svém profilu.</p>
                        </div>
                    )}
                    {error && <p className="text-error text-sm text-end">{error}</p>}
                </div>

                <div className="modal-action flex-wrap gap-y-2">
                    <form method="dialog" className="mr-auto">
                        <button
                            className={cn("btn btn-error", {
                                hidden: step === 3,
                            })}
                            onClick={resetValues}
                        >
                            Zavřít
                        </button>
                    </form>
                    <div className="flex gap-2">
                        <button
                            className={cn("btn btn-primary btn-outline", {
                                hidden: step === 0 || step === 3,
                            })}
                            onClick={() => {
                                setError(null);
                                setStep(step - 1);
                            }}
                        >
                            Zpět
                        </button>
                        <button
                            className="btn btn-primary"
                            disabled={step === 0 && parameter === "default"}
                            onClick={() => {
                                if (step === 0 && parameter !== "default") {
                                    setStep(1);
                                }
                                if (step === 1) {
                                    const check = checkNewValue(newValue);
                                    if (check !== true) {
                                        setError(check);
                                        return;
                                    }
                                    setError(null);
                                    setStep(2);
                                }
                                if (step === 2) {
                                    //todo send data
                                    resetValues();
                                    setStep(3);
                                }
                                if (step === 3) {
                                    resetValues();
                                    (document.getElementById("edit_parameters") as HTMLDialogElement).close();
                                }
                            }}
                        >
                            {step === 2 ? "Odeslat" : step === 3 ? "Dokončit" : "Další krok"}
                        </button>
                    </div>
                </div>
            </div>
        </dialog>
    );
};

export default ParametersEditDialog;
