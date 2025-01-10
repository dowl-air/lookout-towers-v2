import { cn } from "@/utils/cn";
import { useEffect } from "react";

type Step3HoursProps = {
    dayFrom: number;
    dayTo: number;
    handleDayFrom: (dayFrom: number) => void;
    handleDayTo: (dayTo: number) => void;
    lunchBreak: boolean;
    handleLunchBreak: (lunchBreak: boolean) => void;
    lunchFrom: number;
    handleLunchFrom: (lunchFrom: number) => void;
    lunchTo: number;
    handleLunchTo: (lunchTo: number) => void;
    setErrorText: (text: string) => void;
};

const Step3Hours = ({
    dayFrom,
    dayTo,
    lunchBreak,
    lunchFrom,
    lunchTo,
    handleDayFrom,
    handleDayTo,
    handleLunchFrom,
    handleLunchBreak,
    handleLunchTo,
    setErrorText,
}: Step3HoursProps) => {
    useEffect(() => {
        if (dayFrom !== -1 || dayTo !== -1) {
            setErrorText("");
        }
        if (lunchBreak && (lunchFrom !== -1 || lunchTo !== -1)) {
            setErrorText("");
        }
    }, [dayFrom, dayTo, lunchBreak, lunchFrom, lunchTo]);

    return (
        <div className="flex gap-3 ml-8 flex-col">
            <p className="text-base-content">Otevírací doba (např. 9 - 18 hod)</p>
            <div className="flex gap-2">
                <select className="select select-primary text-base-content w-32" value={dayFrom} onChange={(e) => handleDayFrom(+e.target.value)}>
                    <option disabled value={-1}>
                        Od
                    </option>
                    {Array.from(Array(24).keys()).map((m) => (
                        <option key={m} value={m}>
                            {m}
                        </option>
                    ))}
                </select>

                <div className="divider w-6"></div>

                <select className="select select-primary text-base-content w-32" value={dayTo} onChange={(e) => handleDayTo(+e.target.value)}>
                    <option disabled value={-1}>
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
                    onChange={(e) => handleLunchBreak(e.target.checked)}
                    className="checkbox checkbox-primary"
                />
                <span className="label-text">Pauza na oběd</span>
            </label>

            <div className="flex gap-2">
                <select
                    className={cn("select select-primary text-base-content w-32", { "select-disabled": !lunchBreak })}
                    value={lunchFrom}
                    disabled={!lunchBreak}
                    onChange={(e) => handleLunchFrom(+e.target.value)}
                >
                    <option disabled value={-1}>
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
                    className={cn("select select-primary text-base-content w-32", { "select-disabled": !lunchBreak })}
                    value={lunchTo}
                    disabled={!lunchBreak}
                    onChange={(e) => handleLunchTo(+e.target.value)}
                >
                    <option disabled value={-1}>
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
    );
};

export default Step3Hours;
