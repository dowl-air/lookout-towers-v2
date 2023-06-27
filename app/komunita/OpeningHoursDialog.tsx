"use client";
import React, { useRef, useState } from "react";

function OpeningHoursDialog() {
    const [step, setStep] = useState<number>(1);
    const [stepperData, setStepperData] = useState<any>(null);

    const [type, setType] = useState<string>("");

    const manageStepper = () => {
        switch (step) {
            case 1:
                switch (type) {
                    case "freely_accessible":
                        console.log("nice");
                        break;
                    case "every_month":
                        console.log("next");
                        setStep(2);
                    default:
                        break;
                }
                break;

            default:
                break;
        }
    };

    const clearStepper = () => {
        setStep(1);
        setType("");
    };

    const dialogRef = useRef<HTMLDialogElement>(null);

    return (
        <>
            <button className="btn" onClick={() => dialogRef?.current?.showModal()}>
                open modal
            </button>
            <dialog ref={dialogRef} id="modal_opening_hours" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box flex flex-col gap-3">
                    <h3 className="font-bold text-lg self-center">Úprava otevírací doby [věže X]</h3>

                    <ul className="steps mb-2">
                        <li className="step step-primary">Typ</li>
                        <li className="step">Dny</li>
                        <li className="step">Časy</li>
                        <li className="step">Dokončení</li>
                    </ul>

                    <div className={`${step == 1 ? "flex" : "hidden"} flex-col`}>
                        <label className="label cursor-pointer justify-start gap-3">
                            <input
                                type="radio"
                                name="radio-10"
                                value={"freely_accessible"}
                                className="radio checked:bg-green-500"
                                checked={type == "freely_accessible"}
                                onClick={(e) => setType((e.target as HTMLInputElement).value)}
                            />
                            <span className="label-text text-base">Volně přístupná</span>
                        </label>
                        <div className="divider my-1"></div>
                        <label className="label cursor-pointer justify-start gap-3">
                            <input
                                type="radio"
                                name="radio-10"
                                value={"every_month"}
                                className="radio checked:bg-blue-500"
                                checked={type == "every_month"}
                                onClick={(e) => setType((e.target as HTMLInputElement).value)}
                            />
                            <span className="label-text text-base">Každý měsíc</span>
                        </label>
                        <label className="label cursor-pointer justify-start gap-3">
                            <input
                                type="radio"
                                name="radio-10"
                                value={"some_months"}
                                className="radio checked:bg-blue-500"
                                checked={type == "some_months"}
                                onClick={(e) => setType((e.target as HTMLInputElement).value)}
                            />
                            <span className="label-text text-base">Některé měsíce</span>
                        </label>
                        <div className="divider my-1"></div>
                        <label className="label cursor-pointer justify-start gap-3">
                            <input
                                type="radio"
                                name="radio-10"
                                value={"occasionally"}
                                className="radio checked:bg-orange-500"
                                checked={type == "occasionally"}
                                onClick={(e) => setType((e.target as HTMLInputElement).value)}
                            />
                            <span className="label-text text-base">Příležitostně otevřená</span>
                        </label>
                        <label className="label cursor-pointer justify-start gap-3">
                            <input
                                type="radio"
                                name="radio-10"
                                value={"forbidden"}
                                className="radio checked:bg-red-500"
                                checked={type == "forbidden"}
                                onClick={(e) => setType((e.target as HTMLInputElement).value)}
                            />
                            <span className="label-text text-base">Nepřístupná</span>
                        </label>
                    </div>

                    <div className={`${step == 2 ? "flex" : "hidden"} flex-col`}>step two</div>

                    <div className="modal-action">
                        <button
                            className="btn btn-error"
                            onClick={() => {
                                dialogRef?.current?.close();
                                clearStepper();
                            }}
                        >
                            Zavřít
                        </button>
                        <button className="btn btn-primary" onClick={() => manageStepper()}>
                            {type === "freely_accessible" ? "Dokončit" : "Pokračovat"}
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => clearStepper()}>zavřít</button>
                </form>
            </dialog>
        </>
    );
}

export default OpeningHoursDialog;
