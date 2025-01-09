"use client";

import { useRef, useState } from "react";
import { Tower } from "@/typings";
import { OpeningHours, OpeningHoursForbiddenType, OpeningHoursType } from "@/types/OpeningHours";
import Step1 from "@/components/tower/tiles/openingHours/steps/Step1";
import { cn } from "@/utils/cn";
import Step2 from "@/components/tower/tiles/openingHours/steps/Step2";
import Step3Hours from "@/components/tower/tiles/openingHours/steps/Step3Hours";
import Step3Detail from "@/components/tower/tiles/openingHours/steps/Step3Detail";
import OpeningHoursTile from "@/components/tower/tiles/openingHours/OpeningHoursTile";
import { createChange } from "@/actions/changes/change.create";
import { sendMail } from "@/actions/mail";
import { createSubject } from "@/utils/mail";
import { MailSubject } from "@/types/MailSubject";
import { checkAuth } from "@/actions/checkAuth";
import { redirect } from "next/navigation";

function OpeningHoursDialog({ tower }: { tower: Tower }) {
    const [step, setStep] = useState<number>(1);
    const [openingHours, setOpeningHours] = useState<OpeningHours>(tower.openingHours);
    const [errorText, setErrorText] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleTypeChange = (type: OpeningHoursType) => {
        setOpeningHours((old) => ({ ...old, type }));
    };

    const handleMonthFromChange = (month: number) => {
        setOpeningHours((old) => ({ ...old, monthFrom: month }));
    };

    const handleMonthToChange = (month: number) => {
        setOpeningHours((old) => ({ ...old, monthTo: month }));
    };

    const handleIsLockedAtNightChange = (isLockedAtNight: boolean) => {
        setOpeningHours((old) => ({ ...old, isLockedAtNight }));
    };

    const handleDaysChange = (days: number[]) => {
        setOpeningHours((old) => ({ ...old, days }));
    };

    const handleDayFromChange = (dayFrom: number) => {
        setOpeningHours((old) => ({ ...old, dayFrom }));
    };

    const handleDayToChange = (dayTo: number) => {
        setOpeningHours((old) => ({ ...old, dayTo }));
    };

    const handleLunchBreakChange = (lunchBreak: boolean) => {
        setOpeningHours((old) => ({ ...old, lunchBreak }));
    };

    const handleLunchFromChange = (lunchFrom: number) => {
        setOpeningHours((old) => ({ ...old, lunchFrom }));
    };

    const handleLunchToChange = (lunchTo: number) => {
        setOpeningHours((old) => ({ ...old, lunchTo }));
    };

    const handleDetailTextChange = (text: string) => {
        setOpeningHours((old) => ({ ...old, detailText: text }));
    };

    const handleDetailUrlChange = (url: string) => {
        setOpeningHours((old) => ({ ...old, detailUrl: url }));
    };

    const handleForbiddenTypeChange = (type: OpeningHoursForbiddenType) => {
        setOpeningHours((old) => ({ ...old, forbiddenType: type }));
    };

    const manageStepper = () => {
        switch (step) {
            case 1:
                switch (openingHours.type) {
                    case OpeningHoursType.NonStop:
                        return setStep(4);
                    case OpeningHoursType.SomeMonths:
                        if (openingHours.monthFrom === undefined || openingHours.monthFrom < 0) return setErrorText("Není vybrán měsíc od.");
                        if (openingHours.monthTo === undefined || openingHours.monthTo < 0) return setErrorText("Není vybrán měsíc do.");
                    case OpeningHoursType.EveryMonth:
                        return setStep(2);
                    default:
                        return setStep(3);
                }
            case 2:
                if (openingHours.days === undefined || openingHours.days.length === 0) return setErrorText("Není vybrán žádný den.");
                return setStep(3);
            default:
                if (
                    openingHours.type === OpeningHoursType.Forbidden &&
                    (openingHours.forbiddenType === undefined || openingHours.forbiddenType === null)
                )
                    return setErrorText("Nebyla zvolena žádná možnost.");

                if (openingHours.type === OpeningHoursType.SomeMonths || openingHours.type === OpeningHoursType.EveryMonth) {
                    if (openingHours.dayFrom === -1 || openingHours.dayFrom === undefined)
                        return setErrorText("Nebyl vybrán začátek otevírací doby.");
                    if (openingHours.dayTo === -1 || openingHours.dayTo === undefined) return setErrorText("Nebyl vybrán konec otevírací doby.");
                    if (openingHours.dayTo <= openingHours.dayFrom) return setErrorText("Otevírací doba musí začínat dříve, než končit.");
                    if (openingHours.lunchBreak) {
                        if (openingHours.lunchFrom === -1 || openingHours.lunchFrom === undefined)
                            return setErrorText("Nebyl vybrán začátek přestávky.");
                        if (openingHours.lunchTo === -1 || openingHours.lunchTo === undefined) return setErrorText("Nebyl vybrán konec přestávky.");
                        if (openingHours.lunchFrom <= openingHours.dayFrom) return setErrorText("Přestávka začíná dříve než otevírací doba.");
                        if (openingHours.lunchFrom >= openingHours.dayTo) return setErrorText("Přestávka začíná později než otevírací doba.");
                        if (openingHours.lunchTo >= openingHours.dayTo) return setErrorText("Přestávka končí později, než končí otevírací doba.");
                        if (openingHours.lunchTo <= openingHours.dayFrom) return setErrorText("Přestávka končí dříve, než začne otevírací doba.");
                        if (openingHours.lunchTo <= openingHours.lunchFrom) return setErrorText("Přestávka musí začínat dříve, než končit.");
                    }
                }
                return setStep(4);
        }
    };

    const sendNewOpeningHours = async () => {
        if ((await checkAuth()) === null) return redirect("/signin");
        setIsSending(true);
        setErrorText("");
        try {
            await createChange({
                tower_id: tower.id,
                field: "openingHours",
                type: "object",
                old_value: tower.openingHours,
                new_value: openingHours,
            });
            await sendMail({
                subject: createSubject(MailSubject.Info, "Změna otevírací doby"),
                text: `Byl vytvořen návrh otevírací doby rozhledny ${tower.name}.`,
            });
        } catch (e) {
            setErrorText("Nepodařilo se odeslat návrh. Zkuste to prosím později.");
            return setIsSending(false);
        }
        setIsSending(false);
        setStep(5);
    };

    const dialogRef = useRef<HTMLDialogElement>(null);

    return (
        <>
            <div
                className="btn btn-warning btn-sm hidden absolute top-[0.1rem] right-[0.5rem] group-hover:inline-flex"
                onClick={async () => {
                    if ((await checkAuth()) !== null) dialogRef?.current?.showModal();
                    else return redirect("/signin");
                }}
            >
                Navrhnout úpravu
            </div>

            <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box flex flex-col gap-3">
                    <h3 className="font-bold text-lg self-center text-base-content">Úprava otevírací doby {tower.name}</h3>

                    <ul className="steps mb-2 text-base-content">
                        <li className="step step-primary">Stav</li>

                        {openingHours.type === OpeningHoursType.EveryMonth || openingHours.type === OpeningHoursType.SomeMonths ? (
                            <li className={cn("step", { "step-primary": step > 1 })}>Dny</li>
                        ) : null}

                        {openingHours.type === OpeningHoursType.EveryMonth || openingHours.type === OpeningHoursType.SomeMonths ? (
                            <li className={cn("step", { "step-primary": step > 2 })}>Časy</li>
                        ) : null}

                        {openingHours.type === OpeningHoursType.Forbidden ||
                        openingHours.type === OpeningHoursType.Occasionally ||
                        openingHours.type === OpeningHoursType.WillOpen ? (
                            <li className={cn("step", { "step-primary": step > 2 })}>Detail</li>
                        ) : null}

                        <li className={cn("step", { "step-primary": step >= 4 })}>Dokončení</li>
                    </ul>

                    {step === 1 ? (
                        <Step1
                            currentType={openingHours.type}
                            monthFrom={openingHours.monthFrom ?? -1}
                            monthTo={openingHours.monthTo ?? -1}
                            isLockedAtNight={Boolean(openingHours.isLockedAtNight)}
                            handleTypeChange={handleTypeChange}
                            handleMonthFromChange={handleMonthFromChange}
                            handleMonthToChange={handleMonthToChange}
                            handleIsLockedAtNightChange={handleIsLockedAtNightChange}
                            setErrorText={setErrorText}
                        />
                    ) : null}

                    {step === 2 ? <Step2 days={openingHours.days ?? []} handleDaysChange={handleDaysChange} setErrorText={setErrorText} /> : null}

                    {step === 3 && (openingHours.type === OpeningHoursType.EveryMonth || openingHours.type === OpeningHoursType.SomeMonths) ? (
                        <Step3Hours
                            dayFrom={openingHours.dayFrom ?? -1}
                            dayTo={openingHours.dayTo ?? -1}
                            lunchBreak={Boolean(openingHours.lunchBreak)}
                            lunchFrom={openingHours.lunchFrom ?? -1}
                            lunchTo={openingHours.lunchTo ?? -1}
                            handleDayFrom={handleDayFromChange}
                            handleDayTo={handleDayToChange}
                            handleLunchBreak={handleLunchBreakChange}
                            handleLunchFrom={handleLunchFromChange}
                            handleLunchTo={handleLunchToChange}
                            setErrorText={setErrorText}
                        />
                    ) : null}

                    {step === 3 && openingHours.type !== OpeningHoursType.EveryMonth && openingHours.type !== OpeningHoursType.SomeMonths ? (
                        <Step3Detail
                            detailText={openingHours.detailText ?? ""}
                            detailUrl={openingHours.detailUrl ?? ""}
                            handleDetailTextChange={handleDetailTextChange}
                            handleDetailUrlChange={handleDetailUrlChange}
                            type={openingHours.type}
                            forbiddenType={openingHours.forbiddenType}
                            handleForbiddenTypeChange={handleForbiddenTypeChange}
                            setErrorText={setErrorText}
                        />
                    ) : null}

                    <div className={`${step === 4 ? "flex" : "hidden"} flex-col items-center gap-3 text-base-content`}>
                        <h3 className="text-center font-bold pt-5">Takto bude vypadat nová dlaždice s otevírací dobou: </h3>
                        <OpeningHoursTile openingHours={openingHours} />
                    </div>

                    <div className={`${step === 5 ? "flex" : "hidden"} flex-col items-center gap-3 text-base-content`}>
                        <h3 className="text-center font-bold py-5">
                            Děkujeme za navržení změny otevírací doby. Tato změna bude zaslána správci a po schválení bude zveřejněna.
                        </h3>
                    </div>

                    {errorText && <p className="text-error self-end">{errorText}</p>}

                    <div className="modal-action">
                        <button
                            className="btn btn-error mr-auto"
                            onClick={() => {
                                dialogRef?.current?.close();
                                setStep(1);
                            }}
                        >
                            Zavřít
                        </button>

                        {step > 1 && step < 4 ? (
                            <button
                                className="btn btn-outline btn-primary"
                                onClick={() => {
                                    if (
                                        openingHours.type === OpeningHoursType.Forbidden ||
                                        openingHours.type === OpeningHoursType.WillOpen ||
                                        openingHours.type === OpeningHoursType.Occasionally
                                    )
                                        return setStep(1);
                                    setStep((prev) => prev - 1);
                                }}
                            >
                                Zpět
                            </button>
                        ) : null}
                        <button
                            className={`btn ${errorText ? "btn-disabled" : "btn-primary"} ${step >= 4 ? "hidden" : "inline-flex"}`}
                            onClick={() => manageStepper()}
                        >
                            {openingHours.type === OpeningHoursType.NonStop || step === 3 ? "Dokončit" : "Pokračovat"}
                        </button>
                        <button className={`btn btn-primary ${step === 4 ? "inline-flex" : "hidden"}`} onClick={sendNewOpeningHours}>
                            {isSending ? <span className="loading loading-spinner loading-md"></span> : "Odeslat"}
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => setStep(1)}>zavřít</button>
                </form>
            </dialog>
        </>
    );
}

export default OpeningHoursDialog;
