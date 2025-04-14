"use client";

import { OpeningHoursType } from "@/types/OpeningHours";
import { cn } from "@/utils/cn";
import { MONTHS_CZECH } from "@/utils/constants";
import { useEffect } from "react";

type Step1Props = {
    currentType: OpeningHoursType;
    handleTypeChange: (type: OpeningHoursType) => void;
    monthFrom: number;
    monthTo: number;
    handleMonthFromChange: (month: number) => void;
    handleMonthToChange: (month: number) => void;
    isLockedAtNight: boolean;
    handleIsLockedAtNightChange: (isLockedAtNight: boolean) => void;
    setErrorText: (text: string) => void;
};

const Step1 = ({
    currentType,
    handleTypeChange,
    monthFrom,
    monthTo,
    handleMonthFromChange,
    handleMonthToChange,
    isLockedAtNight,
    handleIsLockedAtNightChange,
    setErrorText,
}: Step1Props) => {
    useEffect(() => {
        if (currentType === OpeningHoursType.SomeMonths && monthFrom >= 0 && monthTo >= 0) {
            return setErrorText("");
        }
        if (currentType >= 0) setErrorText("");
    }, [currentType, monthFrom, monthTo]);

    return (
        <div className="flex flex-col">
            <label className="label cursor-pointer justify-start gap-3">
                <input
                    type="radio"
                    value={OpeningHoursType.NonStop}
                    className="radio checked:bg-green-500"
                    checked={currentType === OpeningHoursType.NonStop}
                    onChange={(e) => handleTypeChange(+e.target.value)}
                />
                <span className="label-text text-base">Volně přístupná</span>
            </label>

            <label className="label cursor-pointer justify-start ml-8 gap-2 mt-2">
                <input
                    type="checkbox"
                    checked={isLockedAtNight}
                    disabled={currentType !== OpeningHoursType.NonStop}
                    className="checkbox checkbox-primary"
                    onChange={(e) => handleIsLockedAtNightChange(e.target.checked)}
                />
                <span className="label-text text-base">Zamčeno přes noc</span>
            </label>

            <div className="divider my-1"></div>

            <label className="label cursor-pointer justify-start gap-3">
                <input
                    type="radio"
                    value={OpeningHoursType.EveryMonth}
                    className="radio checked:bg-blue-500"
                    checked={currentType === OpeningHoursType.EveryMonth}
                    onChange={(e) => handleTypeChange(+e.target.value)}
                />
                <span className="label-text text-base">S otevírací dobou po celý rok</span>
            </label>

            <label className="label cursor-pointer justify-start gap-3 my-2">
                <input
                    type="radio"
                    value={OpeningHoursType.SomeMonths}
                    className="radio checked:bg-blue-500"
                    checked={currentType === OpeningHoursType.SomeMonths}
                    onChange={(e) => handleTypeChange(+e.target.value)}
                />
                <span className="label-text text-base">S otevírací dobou, ale jen některé měsíce</span>
            </label>

            <div className="flex gap-3 items-center ml-8">
                <select
                    className={cn("select select-primary text-base-content", {
                        "select-disabled": currentType !== OpeningHoursType.SomeMonths,
                    })}
                    value={monthFrom}
                    disabled={currentType !== OpeningHoursType.SomeMonths}
                    onChange={(e) => handleMonthFromChange(+e.target.value)}
                >
                    <option disabled value={-1}>
                        Od
                    </option>
                    {MONTHS_CZECH.map((m, idx) => (
                        <option key={m} value={idx}>
                            {m}
                        </option>
                    ))}
                </select>

                <div className="divider w-6"></div>

                <select
                    className={cn("select select-primary text-base-content", {
                        "select-disabled": currentType !== OpeningHoursType.SomeMonths,
                    })}
                    value={monthTo}
                    disabled={currentType !== OpeningHoursType.SomeMonths}
                    onChange={(e) => handleMonthToChange(+e.target.value)}
                >
                    <option disabled value={-1}>
                        Do
                    </option>
                    {MONTHS_CZECH.map((m, idx) => (
                        <option key={m} value={idx}>
                            {m}
                        </option>
                    ))}
                </select>
            </div>

            <div className="divider my-1"></div>

            <label className="label cursor-pointer justify-start gap-3">
                <input
                    type="radio"
                    value={OpeningHoursType.Occasionally}
                    className="radio checked:bg-orange-500"
                    checked={currentType === OpeningHoursType.Occasionally}
                    onChange={(e) => handleTypeChange(+e.target.value)}
                />
                <span className="label-text text-base">Příležitostně otevřená</span>
            </label>

            <label className="label cursor-pointer justify-start gap-3 mt-2">
                <input
                    type="radio"
                    value={OpeningHoursType.Forbidden}
                    className="radio checked:bg-red-500"
                    checked={currentType === OpeningHoursType.Forbidden}
                    onChange={(e) => handleTypeChange(+e.target.value)}
                />
                <span className="label-text text-base">Nepřístupná</span>
            </label>

            <div className="divider my-1"></div>

            <label className="label cursor-pointer justify-start gap-3">
                <input
                    type="radio"
                    value={OpeningHoursType.WillOpen}
                    className="radio checked:bg-green-500"
                    checked={currentType === OpeningHoursType.WillOpen}
                    onChange={(e) => handleTypeChange(+e.target.value)}
                />
                <span className="label-text text-base">Před zpřístupněním nebo dokončením rekonstrukce</span>
            </label>
        </div>
    );
};

export default Step1;
