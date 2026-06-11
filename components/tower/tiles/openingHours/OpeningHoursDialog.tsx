"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createChange } from "@/actions/changes/change.create";
import { checkAuth } from "@/actions/checkAuth";
import Dialog from "@/components/shared/dialog/Dialog";
import OpeningHoursTile from "@/components/tower/tiles/openingHours/OpeningHoursTile";
import OpeningHoursButton from "@/components/tower/tiles/openingHours/OpeniongHoursButton";
import Step1 from "@/components/tower/tiles/openingHours/steps/Step1";
import Step2 from "@/components/tower/tiles/openingHours/steps/Step2";
import Step3Detail from "@/components/tower/tiles/openingHours/steps/Step3Detail";
import {
    OpeningHours,
    OpeningHoursForbiddenType,
    OpeningHoursRange,
    OpeningHoursType,
} from "@/types/OpeningHours";
import { Tower } from "@/types/Tower";
import { cn } from "@/utils/cn";
import {
    createDefaultOpeningHoursRange,
    getOpeningHoursRanges,
    getOpeningHoursTypeFromRanges,
    getOpeningHoursValidationError,
    normalizeOpeningHours,
} from "@/utils/openingHours";

function OpeningHoursDialog({ tower }: { tower: Tower }) {
    const [step, setStep] = useState<number>(1);
    const [openingHours, setOpeningHours] = useState<OpeningHours>(tower.openingHours);
    const [errorText, setErrorText] = useState("");
    const [isSending, setIsSending] = useState(false);
    const router = useRouter();

    const handleTypeChange = (type: OpeningHoursType) => {
        setOpeningHours((old) => {
            if (type === OpeningHoursType.EveryMonth || type === OpeningHoursType.SomeMonths) {
                const ranges = getOpeningHoursRanges(old);

                return {
                    ...old,
                    type: getOpeningHoursTypeFromRanges(
                        ranges.length ? ranges : [createDefaultOpeningHoursRange()]
                    ),
                    ranges: ranges.length ? ranges : [createDefaultOpeningHoursRange()],
                };
            }

            return {
                ...old,
                type,
                isLockedAtNight: type === OpeningHoursType.NonStop ? old.isLockedAtNight : false,
            };
        });
    };

    const handleIsLockedAtNightChange = (isLockedAtNight: boolean) => {
        setOpeningHours((old) => ({ ...old, isLockedAtNight }));
    };

    const handleRangesChange = (ranges: OpeningHoursRange[]) => {
        setOpeningHours((old) => ({
            ...old,
            ranges,
            type: getOpeningHoursTypeFromRanges(ranges),
        }));
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
                    case OpeningHoursType.EveryMonth:
                    case OpeningHoursType.SomeMonths:
                        return setStep(2);
                    default:
                        return setStep(3);
                }
            case 2:
                const openingHoursError = getOpeningHoursValidationError(openingHours);
                if (openingHoursError) return setErrorText(openingHoursError);
                setErrorText("");
                return setStep(4);
            default:
                if (
                    openingHours.type === OpeningHoursType.Forbidden &&
                    (openingHours.forbiddenType === undefined ||
                        openingHours.forbiddenType === null)
                )
                    return setErrorText("Nebyla zvolena žádná možnost.");

                const detailError = getOpeningHoursValidationError(openingHours);
                if (detailError) return setErrorText(detailError);

                return setStep(4);
        }
    };

    const sendNewOpeningHours = async () => {
        if ((await checkAuth()) === null) return router.push("/signin");
        setIsSending(true);
        setErrorText("");
        try {
            if (Object.keys(openingHours).includes("note")) {
                delete (openingHours as any).note;
            }
            const newOpeningHours = normalizeOpeningHours(openingHours);
            const validationError = getOpeningHoursValidationError(newOpeningHours);
            if (validationError) {
                setErrorText(validationError);
                return setIsSending(false);
            }
            await createChange({
                tower_id: tower.id,
                field: "openingHours",
                type: "object",
                old_value: tower.openingHours,
                new_value: newOpeningHours,
            });
        } catch {
            setErrorText("Nepodařilo se odeslat návrh. Zkuste to prosím později.");
            return setIsSending(false);
        }
        setIsSending(false);
        setStep(5);
    };

    return (
        <>
            <OpeningHoursButton />

            <Dialog
                id="opening_hours_modal"
                title={`Úprava otevírací doby ${tower.name}`}
                actions={[
                    {
                        label: "Zpět",
                        action: () => {
                            if (
                                step === 4 &&
                                (openingHours.type === OpeningHoursType.EveryMonth ||
                                    openingHours.type === OpeningHoursType.SomeMonths)
                            ) {
                                return setStep(2);
                            }
                            if (
                                step === 4 &&
                                (openingHours.type === OpeningHoursType.Forbidden ||
                                    openingHours.type === OpeningHoursType.WillOpen ||
                                    openingHours.type === OpeningHoursType.Occasionally)
                            ) {
                                return setStep(3);
                            }
                            if (
                                openingHours.type === OpeningHoursType.Forbidden ||
                                openingHours.type === OpeningHoursType.WillOpen ||
                                openingHours.type === OpeningHoursType.Occasionally ||
                                (step === 4 && openingHours.type === OpeningHoursType.NonStop)
                            ) {
                                return setStep(1);
                            }

                            setStep((prev) => prev - 1);
                        },
                        customClass: `btn-primary btn-outline ${step > 1 && step <= 4 ? "inline-flex" : "hidden"}`,
                    },
                    {
                        label:
                            openingHours.type === OpeningHoursType.NonStop || step === 3
                                ? "Dokončit"
                                : "Pokračovat",
                        action: () => manageStepper(),
                        customClass: `btn ${errorText ? "btn-disabled" : "btn-primary"} ${step >= 4 ? "hidden" : "inline-flex"}`,
                    },
                    {
                        label: isSending ? (
                            <span className="loading loading-spinner loading-md"></span>
                        ) : (
                            "Odeslat"
                        ),
                        action: sendNewOpeningHours,
                        customClass: `btn btn-primary ${step === 4 ? "inline-flex" : "hidden"}`,
                    },
                ]}
                onClose={() => setStep(1)}
            >
                <ul className="steps my-5 w-full">
                    <li className="step step-primary">Stav</li>

                    {openingHours.type === OpeningHoursType.EveryMonth ||
                    openingHours.type === OpeningHoursType.SomeMonths ? (
                        <li className={cn("step", { "step-primary": step > 1 })}>Období</li>
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
                        isLockedAtNight={Boolean(openingHours.isLockedAtNight)}
                        handleTypeChange={handleTypeChange}
                        handleIsLockedAtNightChange={handleIsLockedAtNightChange}
                        setErrorText={setErrorText}
                    />
                ) : null}

                {step === 2 ? (
                    <Step2
                        ranges={getOpeningHoursRanges(openingHours)}
                        detailText={openingHours.detailText ?? ""}
                        detailUrl={openingHours.detailUrl ?? ""}
                        handleDetailTextChange={handleDetailTextChange}
                        handleDetailUrlChange={handleDetailUrlChange}
                        handleRangesChange={handleRangesChange}
                        setErrorText={setErrorText}
                    />
                ) : null}

                {step === 3 &&
                openingHours.type !== OpeningHoursType.EveryMonth &&
                openingHours.type !== OpeningHoursType.SomeMonths ? (
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

                <div
                    className={`${step === 4 ? "flex" : "hidden"} flex-col items-center gap-3 text-base-content`}
                >
                    <h3 className="text-center font-bold pt-5">
                        Takto bude vypadat nová dlaždice s otevírací dobou:{" "}
                    </h3>
                    <OpeningHoursTile openingHours={openingHours} />
                </div>

                <div
                    className={`${step === 5 ? "flex" : "hidden"} flex-col items-center gap-3 text-base-content`}
                >
                    <h3 className="text-center font-bold py-5">
                        Děkujeme za navržení změny otevírací doby. Tato změna bude zaslána správci a
                        po schválení bude zveřejněna.
                    </h3>
                </div>

                {errorText && <p className="text-error self-end mt-5">{errorText}</p>}
            </Dialog>
        </>
    );
}

export default OpeningHoursDialog;
