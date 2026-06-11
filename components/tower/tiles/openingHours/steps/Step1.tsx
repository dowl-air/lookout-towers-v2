"use client";

import { useEffect } from "react";

import { OpeningHoursType } from "@/types/OpeningHours";

type Step1Props = {
    currentType: OpeningHoursType;
    handleTypeChange: (type: OpeningHoursType) => void;
    isLockedAtNight: boolean;
    handleIsLockedAtNightChange: (isLockedAtNight: boolean) => void;
    setErrorText: (text: string) => void;
};

const Step1 = ({
    currentType,
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
                    checked={hasOpeningHours}
                    onChange={(e) => handleTypeChange(+e.target.value)}
                />
                <span className="label-text text-base">Má otevírací dobu</span>
            </label>

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
                <span className="label-text text-base">
                    Před zpřístupněním nebo dokončením rekonstrukce
                </span>
            </label>
        </div>
    );
};

export default Step1;
