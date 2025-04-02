import { OpeningHours, OpeningHoursForbiddenType, OpeningHoursType } from "@/types/OpeningHours";
import { Tower } from "@/types/Tower";
import { cn } from "@/utils/cn";
import { DAYS_CZECH, MONTHS_CZECH } from "@/utils/constants";
import Link from "next/link";
import { ReactNode } from "react";

function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const OpeningHoursTile = ({ tower, openingHours, children }: { tower?: Tower; openingHours?: OpeningHours; children?: ReactNode }) => {
    const OH: OpeningHours = tower ? tower.openingHours : openingHours || { type: 0 };

    const isErrorColor = (): boolean => [OpeningHoursType.Forbidden, OpeningHoursType.Occasionally, OpeningHoursType.Unknown].includes(OH.type);
    const isSuccessfulColor = (): boolean => [OpeningHoursType.NonStop, OpeningHoursType.WillOpen].includes(OH.type);

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
                return `${typeCap} je otevřena v\u00a0období `;
            case OpeningHoursType.EveryMonth:
                return `${typeCap} je otevřena celoročně.`;
            case OpeningHoursType.Unknown:
            default:
                return "Neznámá otevírací doba.";
        }
    };

    const getDaysString = (): string => {
        const days = OH.days;
        if (!days) return "Každý den";
        if (days.length == 7) return "Každý den";
        return days.map((e) => DAYS_CZECH.at(e)?.slice(0, 2)).join("·");
    };

    const getTimeString = (): string => {
        if (!OH.dayFrom || !OH.dayTo) return "";
        return ` | ${OH.dayFrom} - ${OH.dayTo} h`;
    };

    const getLunchString = (): string => {
        if (!OH.lunchBreak) return "";
        return `\n Přestávka ${OH.lunchFrom} - ${OH.lunchTo} h`;
    };

    return (
        <div className="card card-compact sm:card-normal min-w-[300px] max-w-[calc(min(94vw,420px))] sm:min-h-[225px] flex-1 overflow-hidden shadow-xl group bg-[rgba(255,255,255,0.05)]">
            <div className="card-body">
                <h2 className="card-title text-base sm:text-lg md:text-xl">Otevírací doba</h2>
                <p
                    className={cn("text-base md:text-lg font-bold", {
                        "text-error": isErrorColor(),
                        "text-success": isSuccessfulColor(),
                    })}
                >
                    {getHeading(tower?.type ?? "rozhledna")}
                    {OH.type === OpeningHoursType.SomeMonths ? (
                        <>
                            <span className="whitespace-nowrap underline">{`${MONTHS_CZECH.at(OH.monthFrom)} - ${MONTHS_CZECH.at(OH.monthTo)}`}</span>
                            <span>.</span>
                        </>
                    ) : null}
                </p>

                {OH.isLockedAtNight ? <p className="text-base md:text-lg">Zamčeno v noci</p> : null}

                {OH.type === OpeningHoursType.SomeMonths || OH.type === OpeningHoursType.EveryMonth ? (
                    <p className="text-base md:text-lg">
                        {getDaysString()} {getTimeString()}
                        {getLunchString()}
                    </p>
                ) : null}

                {OH.detailText ? <p className="text-sm">{OH.detailText}</p> : null}
                {(OH as any).note ? <p className="text-sm">{(OH as any).note}</p> : null}

                {OH.detailUrl ? (
                    <Link href={OH.detailUrl} className="link text-sm" target="_blank">
                        Více informací
                    </Link>
                ) : null}
            </div>
            {children}
        </div>
    );
};

export default OpeningHoursTile;
