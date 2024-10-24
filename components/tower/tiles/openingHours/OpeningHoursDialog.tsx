"use client";
import { DAYS_CZECH, MONTHS_CZECH, OpeningHoursForbiddenType, OpeningHoursType } from "@/utils/constants";
import { useEffect, useRef, useState } from "react";
import { Tower } from "@/typings";
import OpeningHours_ from "./OpeningHours";

function OpeningHoursDialog({ tower }: { tower: Tower }) {
    const [step, setStep] = useState<number>(1);
    const [type, setType] = useState<string>("");

    const [occasionallyText, setOccasionallyText] = useState<string>("");

    const [goneText, setGoneText] = useState<string>("");
    const [goneType, setGoneType] = useState<string>("");

    const [od_, setOd] = useState<string>("");
    const [do_, setDo] = useState<string>("");

    const [weekType, setWeekType] = useState<string>("");
    const [daysSelected, setDaysSelected] = useState<string[]>([]);

    const [dayOd, setDayOd] = useState<number | "">("");
    const [dayDo, setDayDo] = useState<number | "">("");

    const [lunchBreak, setLunchBreak] = useState<boolean>(false);

    const [dayOdLunch, setDayOdLunch] = useState<number | "">("");
    const [dayDoLunch, setDayDoLunch] = useState<number | "">("");

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
                if ((type === "some_months" || type === "every_month") && weekType === "") {
                    return setErrorText("Nebyla zvolena žádná možnost.");
                }
                if ((type === "some_months" || type === "every_month") && weekType === "some_days" && daysSelected.length === 0) {
                    return setErrorText("Není vybrán žádný den.");
                }
                setStep(3);
                break;
            default:
                if (type === "forbidden" && goneType === "") return setErrorText("Nebyla zvolena žádná možnost.");
                if (type === "some_months" || type === "every_month") {
                    if (dayOd === "") return setErrorText("Nebyl vybrán začátek otevírací doby.");
                    if (dayDo === "") return setErrorText("Nebyl vybrán konec otevírací doby.");
                    if (dayDo <= dayOd) return setErrorText("Otevírací doba musí začínat dříve, než končit.");
                    if (lunchBreak) {
                        if (dayOdLunch === "") return setErrorText("Nebyl vybrán začátek přestávky.");
                        if (dayDoLunch === "") return setErrorText("Nebyl vybrán konec přestávky.");
                        if (dayOdLunch <= dayOd) return setErrorText("Přestávka začíná dříve než otevírací doba.");
                        if (dayOdLunch >= dayDo) return setErrorText("Přestávka začíná později než otevírací doba.");
                        if (dayDoLunch >= dayDo) return setErrorText("Přestávka končí později, než končí otevírací doba.");
                        if (dayDoLunch <= dayOd) return setErrorText("Přestávka končí dříve, než začne otevírací doba.");
                        if (dayDoLunch <= dayOdLunch) return setErrorText("Přestávka musí začínat dříve, než končit.");
                    }
                }
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
        setDayDo("");
        setDayOd("");
        setLunchBreak(false);
        setDayOdLunch("");
        setDayDoLunch("");
    };

    const mapTypeEnum = (type: string): number => {
        switch (type) {
            case "freely_accessible":
                return OpeningHoursType.NonStop;
            case "some_months":
            case "every_month":
                return OpeningHoursType.Hours;
            case "forbidden":
                return OpeningHoursType.Forbidden;
            case "occasionally":
                return OpeningHoursType.Occasionally;
            default:
                return OpeningHoursType.Unknown;
        }
    };

    const generateFinalOpeningHours = (): OpeningHours => {
        let obj: OpeningHours = {
            type: mapTypeEnum(type),
        };
        if (type === "forbidden") {
            if (goneType === "reconstruction") obj.forbidden_type = OpeningHoursForbiddenType.Reconstruction;
            if (goneType === "gone") obj.forbidden_type = OpeningHoursForbiddenType.Gone;
            if (goneType === "temporary") obj.forbidden_type = OpeningHoursForbiddenType.Temporary;
        }
        if (type === "forbidden" && goneText) obj.note = goneText;
        if (type === "occasionally" && occasionallyText) obj.note = occasionallyText;
        if (type === "every_month") obj.months = [];
        if (type === "some_months") obj.months = [MONTHS_CZECH.indexOf(od_), MONTHS_CZECH.indexOf(do_)];
        if (type === "some_months" || type === "every_month") {
            if (weekType === "every_day") obj.days = [0, 1, 2, 3, 4, 5, 6];
            if (weekType === "some_days") obj.days = daysSelected.map((e) => DAYS_CZECH.indexOf(e)).sort((a, b) => a - b);
            obj.time_start = parseInt(dayOd.toString());
            obj.time_end = parseInt(dayDo.toString());
            if (lunchBreak) {
                obj.lunch_break = true;
                obj.lunch_start = parseInt(dayOdLunch.toString());
                obj.lunch_end = parseInt(dayDoLunch.toString());
            }
        }
        return obj;
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

    // days selection checker
    useEffect(() => {
        if (daysSelected.length) setErrorText("");
        if (weekType === "every_day") setErrorText("");
    }, [daysSelected, weekType]);

    // time picker checker
    useEffect(() => {
        if (step === 3 && (type === "some_months" || type === "every_month") && (dayOd !== "" || dayDo !== "")) {
            setErrorText("");
        }
        if (step === 3 && (type === "some_months" || type === "every_month") && lunchBreak && (dayOdLunch !== "" || dayDoLunch !== "")) {
            setErrorText("");
        }
    }, [step, type, dayDo, dayOd, lunchBreak, dayDoLunch, dayOdLunch]);

    const dialogRef = useRef<HTMLDialogElement>(null);

    return (
        <>
            <div
                className="btn btn-warning btn-sm hidden absolute top-[0.1rem] right-[0.5rem] group-hover:inline-flex"
                onClick={() => dialogRef?.current?.showModal()}
            >
                Navrhnout úpravu
            </div>
            <dialog ref={dialogRef} id="modal_opening_hours" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box flex flex-col gap-3">
                    <h3 className="font-bold text-lg self-center text-base-content">Úprava otevírací doby {tower.name}</h3>

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
                                disabled={type !== "some_months"}
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
                                disabled={type !== "some_months"}
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

                    <div className={`${step === 3 && (type === "every_month" || type === "some_months") ? "flex" : "hidden"} gap-3 ml-8 flex-col`}>
                        <p className="text-base-content">Otevírací doba (např. 9 - 18)</p>
                        <div className="flex gap-2">
                            <select
                                className={`select select-primary text-base-content w-32`}
                                value={dayOd}
                                onChange={(e) => setDayOd(parseInt((e.target as HTMLSelectElement).value))}
                            >
                                <option disabled value={""}>
                                    Od
                                </option>
                                {Array.from(Array(24).keys()).map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                            <div className="divider w-6"></div>
                            <select
                                className={`select select-primary text-base-content w-32`}
                                value={dayDo}
                                onChange={(e) => setDayDo(parseInt((e.target as HTMLSelectElement).value))}
                            >
                                <option disabled value={""}>
                                    Do
                                </option>
                                {Array.from(Array(24).keys()).map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <label className="label cursor-pointer justify-start gap-3">
                            <input
                                type="checkbox"
                                checked={lunchBreak}
                                onChange={(e) => setLunchBreak(e.target.checked)}
                                className="checkbox checkbox-primary"
                            />
                            <span className="label-text">Pauza na oběd</span>
                        </label>
                        <div className="flex gap-2">
                            <select
                                className={`select ${lunchBreak ? "select-primary" : "select-disabled"} text-base-content w-32`}
                                value={dayOdLunch}
                                disabled={!lunchBreak}
                                onChange={(e) => setDayOdLunch(parseInt((e.target as HTMLSelectElement).value))}
                            >
                                <option disabled value={""}>
                                    Od
                                </option>
                                {Array.from(Array(24).keys()).map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                            <div className="divider w-6"></div>
                            <select
                                className={`select ${lunchBreak ? "select-primary" : "select-disabled"} text-base-content w-32`}
                                value={dayDoLunch}
                                disabled={!lunchBreak}
                                onChange={(e) => setDayDoLunch(parseInt((e.target as HTMLSelectElement).value))}
                            >
                                <option disabled value={""}>
                                    Do
                                </option>
                                {Array.from(Array(24).keys()).map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                        </div>
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
                        <label htmlFor="popis_gone_" className="label text-base-content">
                            Uveďte prosím odkaz nebo podrobný popis okolností uzavření.
                        </label>
                        <textarea
                            id="popis_gone_"
                            className="textarea textarea-primary text-base-content"
                            placeholder="Odkaz nebo popis..."
                            maxLength={300}
                            value={goneText}
                            onChange={(e) => {
                                setGoneText((e.target as HTMLTextAreaElement).value);
                            }}
                        ></textarea>
                    </div>

                    <div className={`${step === 3 && type === "occasionally" ? "flex" : "hidden"} flex-col`}>
                        <label htmlFor="popis_occ_" className="label text-base-content">
                            Uveďte prosím odkaz nebo podrobný popis, při jakých příležitostech je otevřeno.
                        </label>
                        <textarea
                            id="popis_occ_"
                            className="textarea textarea-primary text-base-content"
                            placeholder="Odkaz nebo popis..."
                            maxLength={300}
                            value={occasionallyText}
                            onChange={(e) => {
                                setOccasionallyText((e.target as HTMLTextAreaElement).value);
                            }}
                        ></textarea>
                    </div>

                    <div className={`${step === 4 ? "flex" : "hidden"} flex-col items-center gap-3 text-base-content`}>
                        <h3>Takto bude vypadat nová dlaždice s otevírací dobou: </h3>
                        <OpeningHours_ openingHours={generateFinalOpeningHours()} />
                    </div>

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
                        <button
                            className={`btn btn-primary ${step === 4 ? "inline-flex" : "hidden"}`}
                            onClick={() => {
                                console.log(generateFinalOpeningHours());
                            }}
                        >
                            Odeslat
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
