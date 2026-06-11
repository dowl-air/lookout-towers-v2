import Link from "next/link";
import { ReactNode } from "react";

import { OpeningHours, OpeningHoursForbiddenType, OpeningHoursType } from "@/types/OpeningHours";
import { Tower } from "@/types/Tower";
import { cn } from "@/utils/cn";
import { DAYS_CZECH, MONTHS_CZECH } from "@/utils/constants";
import {
    formatOpeningHour,
    getOpeningHoursRanges,
    normalizeOpeningHours,
} from "@/utils/openingHours";

function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const OpeningHoursTile = ({
    tower,
    openingHours,
    children,
}: {
    tower?: Tower;
    openingHours?: OpeningHours;
    children?: ReactNode;
}) => {
    const OH: OpeningHours = tower
        ? normalizeOpeningHours(tower.openingHours)
        : openingHours
          ? normalizeOpeningHours(openingHours)
          : null;

    const isErrorColor = (): boolean =>
        [
            OpeningHoursType.Forbidden,
            OpeningHoursType.Occasionally,
            OpeningHoursType.Unknown,
        ].includes(OH.type);
    const isSuccessfulColor = (): boolean =>
        [OpeningHoursType.NonStop, OpeningHoursType.WillOpen].includes(OH.type);
    const hasOpeningHoursRanges = (): boolean =>
        OH.type === OpeningHoursType.SomeMonths || OH.type === OpeningHoursType.EveryMonth;

    const getHeading = (towerType: string): string => {
        const typeCap = capitalizeFirstLetter(towerType);
        switch (OH.type) {
            case OpeningHoursType.NonStop:
                return `${typeCap} je volně přístupná.`;
            case OpeningHoursType.Forbidden:
                switch (OH.forbiddenType) {
                    case OpeningHoursForbiddenType.Reconstruction:
                        return `${typeCap} je právě v\u00a0rekonstrukci.`;
                    case OpeningHoursForbiddenType.Temporary:
                        return `${typeCap} je dočasně uzavřena.`;
                    case OpeningHoursForbiddenType.Gone:
                        return `${typeCap} je zaniklá.`;
                    default:
                        return `${typeCap} je trvale uzavřena.`;
                }
            case OpeningHoursType.Occasionally:
                return `${typeCap} je přístupná příležitostně.`;
            case OpeningHoursType.WillOpen:
                return `${typeCap} bude zanedlouho zpřístupněna.`;
            case OpeningHoursType.SomeMonths:
                return `${typeCap} je otevřena v\u00a0období:`;
            case OpeningHoursType.EveryMonth:
                return `${typeCap} je otevřena celoročně.`;
            case OpeningHoursType.Unknown:
            default:
                return "Neznámá otevírací doba.";
        }
    };

    const getDayLabel = (day: number): string => DAYS_CZECH.at(day)?.slice(0, 2) ?? "";

    const getDaysString = (days: number[]): string => {
        if (days.length == 7) return "Každý den";

        const sortedDays = [...new Set(days)].sort((dayA, dayB) => dayA - dayB);
        const dayRanges: string[] = [];
        let rangeStart = sortedDays[0];
        let rangeEnd = sortedDays[0];

        sortedDays.slice(1).forEach((day) => {
            if (day === rangeEnd + 1) {
                rangeEnd = day;
                return;
            }

            dayRanges.push(
                rangeStart === rangeEnd
                    ? getDayLabel(rangeStart)
                    : `${getDayLabel(rangeStart)}-${getDayLabel(rangeEnd)}`
            );
            rangeStart = day;
            rangeEnd = day;
        });

        dayRanges.push(
            rangeStart === rangeEnd
                ? getDayLabel(rangeStart)
                : `${getDayLabel(rangeStart)}-${getDayLabel(rangeEnd)}`
        );

        return dayRanges.join(", ");
    };

    const getRangeRows = () => {
        return getOpeningHoursRanges(OH).map((range) => {
            const months =
                range.monthFrom === 0 && range.monthTo === 11
                    ? "Celoročně"
                    : range.monthFrom === range.monthTo
                      ? MONTHS_CZECH.at(range.monthFrom)
                      : `${MONTHS_CZECH.at(range.monthFrom)} - ${MONTHS_CZECH.at(range.monthTo)}`;
            const hours = `${formatOpeningHour(range.dayFrom)} - ${formatOpeningHour(range.dayTo)} h`;
            const lunch = range.lunchBreak
                ? `Pauza ${formatOpeningHour(range.lunchFrom)} - ${formatOpeningHour(range.lunchTo)} h`
                : "";

            return {
                days: getDaysString(range.days),
                hours,
                lunch,
                months,
            };
        });
    };

    return (
        <div
            tabIndex={0}
            className="card card-compact sm:card-normal min-w-[300px] max-w-[calc(min(94vw,420px))] sm:min-h-[225px] flex-1 overflow-hidden shadow-xl group bg-[rgba(255,255,255,0.05)]"
        >
            <div className="card-body">
                <h2 className="card-title text-base sm:text-lg md:text-xl">Otevírací doba</h2>
                {OH ? (
                    <>
                        {!hasOpeningHoursRanges() ? (
                            <p
                                className={cn("grow-0 text-base md:text-lg font-bold", {
                                    "text-error": isErrorColor(),
                                    "text-success": isSuccessfulColor(),
                                })}
                            >
                                {getHeading(tower?.type ?? "rozhledna")}
                            </p>
                        ) : null}

                        {OH.type === OpeningHoursType.NonStop && OH.isLockedAtNight ? (
                            <p className="grow-0 text-base md:text-lg">Zamčeno přes noc.</p>
                        ) : null}

                        {hasOpeningHoursRanges() ? (
                            <div className="flex grow-0 flex-col divide-y divide-base-content/10 text-base">
                                {getRangeRows().map((range) => (
                                    <div
                                        key={`${range.months}-${range.days}-${range.hours}`}
                                        className="py-2 first:pt-0 last:pb-0"
                                    >
                                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                                            <span className="font-semibold text-base-content">
                                                {range.months}
                                            </span>
                                            <span className="font-medium text-base-content">
                                                {range.hours}
                                            </span>
                                        </div>
                                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-base-content/75">
                                            <span>{range.days}</span>
                                            {range.lunch ? <span>{range.lunch}</span> : null}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : null}

                        {OH.detailText ? <p className="grow-0 text-sm">{OH.detailText}</p> : null}
                        {(OH as any).note ? (
                            <p className="grow-0 text-sm">{(OH as any).note}</p>
                        ) : null}

                        {OH.detailUrl ? (
                            <Link href={OH.detailUrl} className="link text-sm" target="_blank">
                                Oficiální otevírací doba
                            </Link>
                        ) : null}
                    </>
                ) : (
                    <span className="skeleton h-6 w-full mt-3" />
                )}
            </div>
            {children}
        </div>
    );
};

export default OpeningHoursTile;
