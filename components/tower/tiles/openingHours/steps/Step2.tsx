import { OpeningHoursRange } from "@/types/OpeningHours";
import { cn } from "@/utils/cn";
import { DAYS_CZECH, MONTHS_CZECH } from "@/utils/constants";
import { createDefaultOpeningHoursRange } from "@/utils/openingHours";

type Step2Props = {
    ranges: OpeningHoursRange[];
    detailText: string;
    detailUrl: string;
    handleDetailTextChange: (text: string) => void;
    handleDetailUrlChange: (url: string) => void;
    handleRangesChange: (ranges: OpeningHoursRange[]) => void;
    setErrorText: (text: string) => void;
};

const timeFromOptions = Array.from(Array(24).keys());
const timeToOptions = Array.from(Array(25).keys()).slice(1);

const getFirstAvailableMonth = (ranges: OpeningHoursRange[]): number => {
    const usedMonths = new Set<number>();

    ranges.forEach((range) => {
        for (let month = range.monthFrom; month <= range.monthTo; month += 1) {
            usedMonths.add(month);
        }
    });

    return Array.from(Array(12).keys()).find((month) => !usedMonths.has(month)) ?? 0;
};

const hasAvailableMonth = (ranges: OpeningHoursRange[]): boolean => {
    const usedMonths = new Set<number>();

    ranges.forEach((range) => {
        for (let month = range.monthFrom; month <= range.monthTo; month += 1) {
            usedMonths.add(month);
        }
    });

    return usedMonths.size < 12;
};

const Step2 = ({
    ranges,
    detailText,
    detailUrl,
    handleDetailTextChange,
    handleDetailUrlChange,
    handleRangesChange,
    setErrorText,
}: Step2Props) => {
    const canAddRange = hasAvailableMonth(ranges);

    const updateRange = (idx: number, partialRange: Partial<OpeningHoursRange>) => {
        setErrorText("");
        handleRangesChange(
            ranges.map((range, rangeIdx) =>
                rangeIdx === idx ? { ...range, ...partialRange } : range
            )
        );
    };

    const addRange = () => {
        if (!canAddRange) return;

        setErrorText("");
        const month = getFirstAvailableMonth(ranges);
        handleRangesChange([
            ...ranges,
            {
                ...createDefaultOpeningHoursRange(),
                monthFrom: month,
                monthTo: month,
            },
        ]);
    };

    const removeRange = (idx: number) => {
        setErrorText("");
        handleRangesChange(ranges.filter((_range, rangeIdx) => rangeIdx !== idx));
    };

    const toggleDay = (range: OpeningHoursRange, idx: number, day: number, checked: boolean) => {
        if (checked) {
            updateRange(idx, {
                days: range.days.includes(day) ? range.days : [...range.days, day].sort(),
            });
            return;
        }

        updateRange(idx, { days: range.days.filter((storedDay) => storedDay !== day) });
    };

    const toggleLunchBreak = (idx: number, checked: boolean) => {
        updateRange(idx, {
            lunchBreak: checked,
            lunchFrom: checked ? ranges[idx].lunchFrom : undefined,
            lunchTo: checked ? ranges[idx].lunchTo : undefined,
        });
    };

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4">
                {ranges.map((range, idx) => (
                    <section key={idx} className="rounded-lg border border-base-300 p-3">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <h3 className="font-bold">Období {idx + 1}</h3>
                            {ranges.length > 1 ? (
                                <button
                                    type="button"
                                    className="btn btn-error btn-outline btn-xs"
                                    onClick={() => removeRange(idx)}
                                >
                                    Odebrat
                                </button>
                            ) : null}
                        </div>

                        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
                            <select
                                className="select select-primary w-full min-w-0 text-base-content"
                                value={range.monthFrom}
                                onChange={(event) =>
                                    updateRange(idx, { monthFrom: +event.target.value })
                                }
                            >
                                {MONTHS_CZECH.map((month, monthIdx) => (
                                    <option key={month} value={monthIdx}>
                                        {month}
                                    </option>
                                ))}
                            </select>

                            <span className="text-sm text-base-content/70">až</span>

                            <select
                                className="select select-primary w-full min-w-0 text-base-content"
                                value={range.monthTo}
                                onChange={(event) =>
                                    updateRange(idx, { monthTo: +event.target.value })
                                }
                            >
                                {MONTHS_CZECH.map((month, monthIdx) => (
                                    <option key={month} value={monthIdx}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-1">
                            {DAYS_CZECH.map((day, dayIdx) => (
                                <label
                                    key={day}
                                    className="label cursor-pointer flex-col gap-1 px-1"
                                >
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-primary"
                                        checked={range.days.includes(dayIdx)}
                                        onChange={(event) =>
                                            toggleDay(range, idx, dayIdx, event.target.checked)
                                        }
                                    />
                                    <span className="label-text text-xs">{day.slice(0, 2)}</span>
                                </label>
                            ))}
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <select
                                className="select select-primary text-base-content w-28"
                                value={range.dayFrom}
                                onChange={(event) =>
                                    updateRange(idx, { dayFrom: +event.target.value })
                                }
                            >
                                {timeFromOptions.map((hour) => (
                                    <option key={hour} value={hour}>
                                        {hour}
                                    </option>
                                ))}
                            </select>

                            <span className="text-sm text-base-content/70">-</span>

                            <select
                                className="select select-primary text-base-content w-28"
                                value={range.dayTo}
                                onChange={(event) =>
                                    updateRange(idx, { dayTo: +event.target.value })
                                }
                            >
                                {timeToOptions.map((hour) => (
                                    <option key={hour} value={hour}>
                                        {hour}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <label className="label mt-3 cursor-pointer justify-start gap-3">
                            <input
                                type="checkbox"
                                checked={Boolean(range.lunchBreak)}
                                onChange={(event) => toggleLunchBreak(idx, event.target.checked)}
                                className="checkbox checkbox-primary"
                            />
                            <span className="label-text">Pauza na oběd</span>
                        </label>

                        {range.lunchBreak ? (
                            <div className="flex flex-wrap items-center gap-2">
                                <select
                                    className="select select-primary w-28 text-base-content"
                                    value={range.lunchFrom ?? -1}
                                    onChange={(event) =>
                                        updateRange(idx, { lunchFrom: +event.target.value })
                                    }
                                >
                                    <option disabled value={-1}>
                                        Od
                                    </option>
                                    {timeFromOptions.map((hour) => (
                                        <option key={hour} value={hour}>
                                            {hour}
                                        </option>
                                    ))}
                                </select>

                                <span className="text-sm text-base-content/70">-</span>

                                <select
                                    className="select select-primary w-28 text-base-content"
                                    value={range.lunchTo ?? -1}
                                    onChange={(event) =>
                                        updateRange(idx, { lunchTo: +event.target.value })
                                    }
                                >
                                    <option disabled value={-1}>
                                        Do
                                    </option>
                                    {timeToOptions.map((hour) => (
                                        <option key={hour} value={hour}>
                                            {hour}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : null}
                    </section>
                ))}
            </div>

            <button
                type="button"
                className={cn("btn btn-primary btn-outline", { "btn-disabled": !canAddRange })}
                disabled={!canAddRange}
                onClick={addRange}
            >
                Přidat období
            </button>

            <label className="flex flex-col gap-2">
                <div className="label">
                    <span className="label-text">
                        Odkaz na oficiální otevírací dobu{" "}
                        <span className="text-xs text-base-content/60">(nepovinné)</span>
                    </span>
                </div>
                <input
                    type="url"
                    className="input input-primary w-full"
                    placeholder="https://..."
                    maxLength={500}
                    value={detailUrl}
                    onChange={(event) => {
                        setErrorText("");
                        handleDetailUrlChange(event.target.value);
                    }}
                />
            </label>

            <label className="flex flex-col gap-2">
                <div className="label">
                    <span className="label-text">
                        Poznámka <span className="text-xs text-base-content/60">(nepovinné)</span>
                    </span>
                </div>
                <textarea
                    className="textarea textarea-primary w-full"
                    placeholder="Doplňující informace k otevírací době"
                    maxLength={500}
                    value={detailText}
                    onChange={(event) => {
                        setErrorText("");
                        handleDetailTextChange(event.target.value);
                    }}
                />
            </label>
        </div>
    );
};

export default Step2;
