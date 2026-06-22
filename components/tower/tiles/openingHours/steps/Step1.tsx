"use client";

import { useEffect } from "react";

import { OpeningHoursForbiddenType, OpeningHoursType } from "@/types/OpeningHours";
import { cn } from "@/utils/cn";

type Step1Props = {
    currentType: OpeningHoursType;
    detailText: string;
    detailUrl: string;
    forbiddenType?: OpeningHoursForbiddenType;
    handleDetailTextChange: (text: string) => void;
    handleDetailUrlChange: (url: string) => void;
    handleForbiddenTypeChange: (type: OpeningHoursForbiddenType) => void;
    handleTypeChange: (type: OpeningHoursType) => void;
    isLockedAtNight: boolean;
    handleIsLockedAtNightChange: (isLockedAtNight: boolean) => void;
    setErrorText: (text: string) => void;
};

const Step1 = ({
    currentType,
    detailText,
    detailUrl,
    forbiddenType,
    handleDetailTextChange,
    handleDetailUrlChange,
    handleForbiddenTypeChange,
    handleTypeChange,
    isLockedAtNight,
    handleIsLockedAtNightChange,
    setErrorText,
}: Step1Props) => {
    useEffect(() => {
        if (currentType >= 0) setErrorText("");
    }, [currentType, setErrorText]);

    const hasOpeningHours =
        currentType === OpeningHoursType.EveryMonth || currentType === OpeningHoursType.SomeMonths;

    const handleChangeType = (type: OpeningHoursType) => {
        setErrorText("");
        handleTypeChange(type);
    };

    const optionClassName = (active: boolean) =>
        cn(
            "flex cursor-pointer items-start gap-3 rounded-lg border border-base-300/70 bg-base-100 p-4 transition hover:border-primary/50 hover:bg-base-200/45",
            active && "border-primary/60 bg-primary/5"
        );

    const detailFields = (
        <div className="mt-4 space-y-4 border-t border-base-300/70 pt-4">
            <div className="text-sm font-semibold text-base-content/70">Doplňující informace</div>
            <label className="block cursor-default" onClick={(event) => event.stopPropagation()}>
                <span className="label-text mb-2 block">Detailní popis</span>
                <textarea
                    className="textarea textarea-bordered min-h-28 w-full rounded-lg bg-base-100"
                    placeholder="Doplňující informace k přístupnosti"
                    maxLength={500}
                    value={detailText}
                    onChange={(event) => {
                        setErrorText("");
                        handleDetailTextChange(event.target.value);
                    }}
                />
            </label>
            <label className="block cursor-default" onClick={(event) => event.stopPropagation()}>
                <span className="label-text mb-2 block">URL adresa</span>
                <input
                    type="url"
                    className="input input-bordered w-full rounded-lg bg-base-100"
                    placeholder="https://..."
                    maxLength={500}
                    value={detailUrl}
                    onChange={(event) => {
                        setErrorText("");
                        handleDetailUrlChange(event.target.value);
                    }}
                />
            </label>
        </div>
    );

    return (
        <div className="space-y-4">
            <div
                className={optionClassName(currentType === OpeningHoursType.NonStop)}
                onClick={() => handleChangeType(OpeningHoursType.NonStop)}
            >
                <input
                    type="radio"
                    value={OpeningHoursType.NonStop}
                    className="radio radio-primary mt-0.5"
                    checked={currentType === OpeningHoursType.NonStop}
                    onChange={(event) => handleChangeType(+event.target.value)}
                />
                <span className="min-w-0 flex-1">
                    <span className="block font-semibold">Volně přístupná</span>
                    <span className="mt-1 block text-sm text-base-content/65">
                        Přístup bez omezené otevírací doby.
                    </span>
                    {currentType === OpeningHoursType.NonStop ? (
                        <label
                            className="mt-4 flex cursor-pointer items-center gap-3 rounded-lg border border-base-300/70 bg-base-200/35 p-3"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <input
                                type="checkbox"
                                checked={isLockedAtNight}
                                className="checkbox checkbox-primary"
                                onChange={(event) => {
                                    setErrorText("");
                                    handleIsLockedAtNightChange(event.target.checked);
                                }}
                            />
                            <span className="label-text text-base">Zamčeno přes noc</span>
                        </label>
                    ) : null}
                </span>
            </div>

            <div
                className={optionClassName(hasOpeningHours)}
                onClick={() => handleChangeType(OpeningHoursType.EveryMonth)}
            >
                <input
                    type="radio"
                    value={OpeningHoursType.EveryMonth}
                    className="radio radio-primary mt-0.5"
                    checked={hasOpeningHours}
                    onChange={(event) => handleChangeType(+event.target.value)}
                />
                <span className="min-w-0 flex-1">
                    <span className="block font-semibold">Má otevírací dobu</span>
                    <span className="mt-1 block text-sm text-base-content/65">
                        Vyplníte sezony, dny a časy otevření.
                    </span>
                </span>
            </div>

            <div
                className={optionClassName(currentType === OpeningHoursType.Occasionally)}
                onClick={() => handleChangeType(OpeningHoursType.Occasionally)}
            >
                <input
                    type="radio"
                    value={OpeningHoursType.Occasionally}
                    className="radio radio-primary mt-0.5"
                    checked={currentType === OpeningHoursType.Occasionally}
                    onChange={(event) => handleChangeType(+event.target.value)}
                />
                <span className="min-w-0 flex-1">
                    <span className="block font-semibold">Příležitostně otevřená</span>
                    <span className="mt-1 block text-sm text-base-content/65">
                        Přístup bývá možný jen při akcích nebo po domluvě.
                    </span>
                    {currentType === OpeningHoursType.Occasionally ? detailFields : null}
                </span>
            </div>

            <div
                className={optionClassName(currentType === OpeningHoursType.Forbidden)}
                onClick={() => handleChangeType(OpeningHoursType.Forbidden)}
            >
                <input
                    type="radio"
                    value={OpeningHoursType.Forbidden}
                    className="radio radio-primary mt-0.5"
                    checked={currentType === OpeningHoursType.Forbidden}
                    onChange={(event) => handleChangeType(+event.target.value)}
                />
                <span className="min-w-0 flex-1">
                    <span className="block font-semibold">Nepřístupná</span>
                    <span className="mt-1 block text-sm text-base-content/65">
                        Objekt je uzavřený, zaniklý nebo nepřístupný.
                    </span>
                    {currentType === OpeningHoursType.Forbidden ? (
                        <span className="mt-4 block border-t border-base-300/70 pt-4">
                            <span className="mb-3 block text-sm font-semibold text-base-content/70">
                                Typ uzavření
                            </span>
                            <span className="grid gap-2 sm:grid-cols-2">
                                {[
                                    [OpeningHoursForbiddenType.Reconstruction, "V rekonstrukci"],
                                    [OpeningHoursForbiddenType.Temporary, "Dočasně uzavřeno"],
                                    [OpeningHoursForbiddenType.Banned, "Trvale uzavřeno"],
                                    [OpeningHoursForbiddenType.Gone, "Zaniklý objekt"],
                                ].map(([value, label]) => (
                                    <label
                                        key={value}
                                        className="flex cursor-pointer items-center gap-2"
                                        onClick={(event) => event.stopPropagation()}
                                    >
                                        <input
                                            type="radio"
                                            className="radio radio-primary radio-sm"
                                            checked={forbiddenType === value}
                                            onChange={() => {
                                                setErrorText("");
                                                handleForbiddenTypeChange(
                                                    value as OpeningHoursForbiddenType
                                                );
                                            }}
                                        />
                                        <span className="text-sm">{label}</span>
                                    </label>
                                ))}
                            </span>
                            {detailFields}
                        </span>
                    ) : null}
                </span>
            </div>

            <div
                className={optionClassName(currentType === OpeningHoursType.WillOpen)}
                onClick={() => handleChangeType(OpeningHoursType.WillOpen)}
            >
                <input
                    type="radio"
                    value={OpeningHoursType.WillOpen}
                    className="radio radio-primary mt-0.5"
                    checked={currentType === OpeningHoursType.WillOpen}
                    onChange={(event) => handleChangeType(+event.target.value)}
                />
                <span className="min-w-0 flex-1">
                    <span className="block font-semibold">Před zpřístupněním</span>
                    <span className="mt-1 block text-sm text-base-content/65">
                        Rozhledna čeká na otevření nebo dokončení rekonstrukce.
                    </span>
                    {currentType === OpeningHoursType.WillOpen ? detailFields : null}
                </span>
            </div>
        </div>
    );
};

export default Step1;
