"use client";
import { DAYS_CZECH, MONTHS_CZECH } from "@/utils/constants";
import React, { useEffect, useRef, useState } from "react";

function OpeningHoursDialog() {
    const [step, setStep] = useState<number>(1);
    const [stepperData, setStepperData] = useState<any>(null);

    const [type, setType] = useState<string>("");

    const [occasionallyText, setOccasionallyText] = useState<string>("");

    const [goneText, setGoneText] = useState<string>("");
    const [goneType, setGoneType] = useState<string>("");

    const [od_, setOd] = useState<string>("");
    const [do_, setDo] = useState<string>("");

    const [weekType, setWeekType] = useState<string>("");
    const [daysSelected, setDaysSelected] = useState<string[]>([]);

    const [errorText, setErrorText] = useState("");

    const manageStepper = () => {
        if (type === "") return setErrorText("Nebyla zvolena žádná možnost.");
        switch (step) {
            case 1:
                switch (type) {
                    case "freely_accessible":
                        setStep(4);
                        break;
                    case "some_months":
                        if (od_ === "") return setErrorText("Není vybráno od.");
                        if (do_ === "") return setErrorText("Není vybráno do.");
                    case "every_month":
                        setStep(2);
                        break;
                    default:
                        setStep(3);
                        break;
                }
                break;
            case 2:
                if ((type === "some_months" || type === "every_month") && weekType === "some_days" && daysSelected.length === 0) {
                    return setErrorText("Není vybrán žádný den.");
                }
                setStep(3);
                break;
            default:
                if (type === "forbidden" && goneType === "") return setErrorText("Nebyla zvolena žádná možnost.");
                setStep(4);
                break;
        }
    };

    const clearStepper = () => {
        setStep(1);
        setType("");
        setOccasionallyText("");
        setGoneText("");
        setGoneType("");
        setOd("");
        setDo("");
        setErrorText("");
        setWeekType("");
        setDaysSelected([]);
    };

    // months checker
    useEffect(() => {
        if (step === 1 && type === "some_months" && od_ && do_) {
            return setErrorText("");
        }
        if (step === 1 && type !== "") setErrorText("");
    }, [od_, do_, step, type]);

    // gone type checker
    useEffect(() => {
        if (step === 3 && type === "forbidden") {
            if (!goneType) return;
            if (goneType) setErrorText("");
        }
    }, [step, type, goneType]);

    useEffect(() => {
        if (daysSelected.length) setErrorText("");
        if (weekType === "every_day") setErrorText("");
    }, [daysSelected, weekType]);

    const dialogRef = useRef<HTMLDialogElement>(null);

    return (
        <>
            <button className="btn" onClick={() => dialogRef?.current?.showModal()}>
                open modal
            </button>
            <dialog ref={dialogRef} id="modal_opening_hours" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box flex flex-col gap-3">
                    <h3 className="font-bold text-lg self-center text-base-content">Úprava otevírací doby [věže X]</h3>

                    <ul className="steps mb-2 text-base-content">
                        <li className="step step-primary">Stav</li>

                        {(type === "" || type === "every_month" || type === "some_months") && (
                            <li className={`step ${step >= 2 && "step-primary"}`}>Dny</li>
                        )}

                        {(type === "" || type === "every_month" || type === "some_months") && (
                            <li className={`step ${step >= 3 && "step-primary"}`}>Časy</li>
                        )}

                        {(type === "forbidden" || type === "occasionally") && <li className={`step ${step >= 3 && "step-primary"}`}>Detail</li>}

                        <li className={`step ${step === 4 && "step-primary"}`}>Dokončení</li>
                    </ul>

                    <div className={`${step == 1 ? "flex" : "hidden"} flex-col`}>
                        <label className="label cursor-pointer justify-start gap-3">
                            <input
                                type="radio"
                                name="radio-10"
                                value={"freely_accessible"}
                                className="radio checked:bg-green-500"
                                checked={type == "freely_accessible"}
                                onChange={(e) => setType((e.target as HTMLInputElement).value)}
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
                                onChange={(e) => setType((e.target as HTMLInputElement).value)}
                            />
                            <span className="label-text text-base">S otevírací dobou po celý rok</span>
                        </label>
                        <label className="label cursor-pointer justify-start gap-3">
                            <input
                                type="radio"
                                name="radio-10"
                                value={"some_months"}
                                className="radio checked:bg-blue-500"
                                checked={type == "some_months"}
                                onChange={(e) => setType((e.target as HTMLInputElement).value)}
                            />
                            <span className="label-text text-base">S otevírací dobou některé měsíce</span>
                        </label>
                        <div className={`flex gap-3 items-center ml-8`}>
                            <select
                                className={`select ${type === "some_months" ? "select-primary" : "select-disabled"} select-primary text-base-content`}
                                value={od_}
                                onChange={(e) => setOd((e.target as HTMLSelectElement).value)}
                            >
                                <option disabled value={""}>
                                    Od
                                </option>
                                {MONTHS_CZECH.map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                            <div className="divider w-6"></div>
                            <select
                                className={`select ${type === "some_months" ? "select-primary" : "select-disabled"} select-primary text-base-content`}
                                value={do_}
                                onChange={(e) => setDo((e.target as HTMLSelectElement).value)}
                            >
                                <option disabled value={""}>
                                    Do
                                </option>
                                {MONTHS_CZECH.map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="divider my-1"></div>
                        <label className="label cursor-pointer justify-start gap-3">
                            <input
                                type="radio"
                                name="radio-10"
                                value={"occasionally"}
                                className="radio checked:bg-orange-500"
                                checked={type == "occasionally"}
                                onChange={(e) => setType((e.target as HTMLInputElement).value)}
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
                                onChange={(e) => setType((e.target as HTMLInputElement).value)}
                            />
                            <span className="label-text text-base">Nepřístupná</span>
                        </label>
                    </div>

                    <div className={`${step === 2 && (type === "every_month" || type === "some_months") ? "flex" : "hidden"} flex-col`}>
                        <label className="label cursor-pointer justify-start gap-3">
                            <input
                                type="radio"
                                name="radio-week"
                                value={"every_day"}
                                className="radio checked:bg-green-500"
                                checked={weekType == "every_day"}
                                onChange={(e) => setWeekType((e.target as HTMLInputElement).value)}
                            />
                            <span className="label-text text-base">Každý den v týdnu</span>
                        </label>
                        <label className="label cursor-pointer justify-start gap-3">
                            <input
                                type="radio"
                                name="radio-week"
                                value={"some_days"}
                                className="radio checked:bg-blue-500"
                                checked={weekType == "some_days"}
                                onChange={(e) => setWeekType((e.target as HTMLInputElement).value)}
                            />
                            <span className="label-text text-base">Pouze některé dny</span>
                        </label>
                        <div className="flex sm:gap-1 flex-wrap">
                            {DAYS_CZECH.map((d) => (
                                <label key={d} className="cursor-pointer label flex flex-col gap-1">
                                    <input
                                        type="checkbox"
                                        className={`checkbox checkbox-primary checkbox-lg`}
                                        disabled={weekType !== "some_days"}
                                        checked={daysSelected.includes(d)}
                                        onChange={(e) => {
                                            console.log(daysSelected);
                                            if ((e.target as HTMLInputElement).checked) {
                                                if (!(d in daysSelected)) setDaysSelected((old) => [...old, d]);
                                            } else {
                                                setDaysSelected(daysSelected.filter((e) => e !== d));
                                            }
                                        }}
                                    />
                                    <span className="label-text">{d}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className={`${step === 3 && (type === "every_month" || type === "some_months") ? "flex" : "hidden"} flex-col`}>
                        step three - times
                    </div>

                    <div className={`${step === 3 && type === "forbidden" ? "flex" : "hidden"} flex-col`}>
                        <label className="label cursor-pointer justify-start gap-3">
                            <input
                                type="radio"
                                name="radio-gone"
                                value={"reconstruction"}
                                className="radio checked:bg-blue-500"
                                checked={goneType == "reconstruction"}
                                onChange={(e) => setGoneType((e.target as HTMLInputElement).value)}
                            />
                            <span className="label-text text-base">V rekonstrukci</span>
                        </label>
                        <label className="label cursor-pointer justify-start gap-3">
                            <input
                                type="radio"
                                name="radio-gone"
                                value={"temporary"}
                                className="radio checked:bg-orange-500"
                                checked={goneType == "temporary"}
                                onChange={(e) => setGoneType((e.target as HTMLInputElement).value)}
                            />
                            <span className="label-text text-base">Dočasně uzavřeno z jiných důvodů</span>
                        </label>
                        <label className="label cursor-pointer justify-start gap-3">
                            <input
                                type="radio"
                                name="radio-gone"
                                value={"gone"}
                                className="radio checked:bg-red-500"
                                checked={goneType == "gone"}
                                onChange={(e) => setGoneType((e.target as HTMLInputElement).value)}
                            />
                            <span className="label-text text-base">Zaniklý objekt</span>
                        </label>
                        <label htmlFor="popis_gone_" className="label">
                            Uveďte prosím odkaz nebo podrobný popis okolností uzavření.
                        </label>
                        <textarea
                            id="popis_gone_"
                            className="textarea textarea-primary"
                            placeholder="Odkaz nebo popis..."
                            maxLength={300}
                            value={goneText}
                            onChange={(e) => {
                                setGoneText((e.target as HTMLTextAreaElement).value);
                            }}
                        ></textarea>
                    </div>

                    <div className={`${step === 3 && type === "occasionally" ? "flex" : "hidden"} flex-col`}>
                        <label htmlFor="popis_occ_" className="label">
                            Uveďte prosím odkaz nebo podrobný popis, při jakých příležitostech je otevřeno.
                        </label>
                        <textarea
                            id="popis_occ_"
                            className="textarea textarea-primary"
                            placeholder="Odkaz nebo popis..."
                            maxLength={300}
                            value={occasionallyText}
                            onChange={(e) => {
                                setOccasionallyText((e.target as HTMLTextAreaElement).value);
                            }}
                        ></textarea>
                    </div>

                    <div className={`${step === 4 ? "flex" : "hidden"} flex-col`}>FINAL SCREEN</div>

                    {errorText && <p className="text-error self-end">{errorText}</p>}

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
                        <button
                            className={`btn ${errorText ? "btn-disabled" : "btn-primary"} ${step === 4 ? "hidden" : "inline-flex"}`}
                            onClick={() => manageStepper()}
                        >
                            {type === "freely_accessible" || step === 3 ? "Dokončit" : "Pokračovat"}
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
