import { DAYS_CZECH } from "@/utils/constants";
import { useEffect } from "react";

type Step2Props = {
    days: number[];
    handleDaysChange: (days: number[]) => void;
    setErrorText: (text: string) => void;
};

const Step2 = ({ days, handleDaysChange, setErrorText }: Step2Props) => {
    useEffect(() => {
        if (days.length) setErrorText("");
    }, [days]);

    return (
        <div className="flex flex-col gap-5">
            <label className="label cursor-pointer justify-start gap-3">
                <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={days.length === 7}
                    onChange={(e) => {
                        if (e.target.checked) handleDaysChange([...Array(7).keys()]);
                        else handleDaysChange([]);
                    }}
                />
                <span className="label-text text-base">Každý den v týdnu</span>
            </label>

            <div className="flex justify-center sm:gap-1 flex-wrap">
                {DAYS_CZECH.map((d, idx) => (
                    <label key={d} className="cursor-pointer label flex flex-col gap-1">
                        <input
                            type="checkbox"
                            className="checkbox checkbox-primary checkbox-lg"
                            checked={days.includes(idx)}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    if (!days.includes(idx)) handleDaysChange([...days, idx]);
                                } else {
                                    handleDaysChange(days.filter((e) => e !== idx));
                                }
                            }}
                        />
                        <span className="label-text">{d}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default Step2;
