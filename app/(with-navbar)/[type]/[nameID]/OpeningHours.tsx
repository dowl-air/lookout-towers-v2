import { OpeningHours, Tower } from "@/typings";
import { DAYS_CZECH, MONTHS_CZECH, OpeningHoursForbiddenType, OpeningHoursType } from "@/utils/constants";
import React, { ReactNode } from "react";

function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const getDaysString = (days?: number[]): string => {
    if (!days) return "Každý den";
    if (days.length == 7) return "Každý den";
    return days.map((e) => DAYS_CZECH.at(e)?.slice(0, 2)).join("·");
};

const getLunchString = (openingHours: OpeningHours): string => {
    if (!openingHours.lunch_break) return "";
    return `\n Přestávka ${openingHours.lunch_start} - ${openingHours.lunch_end} h`;
};

const isErrorColor = (openingHours: OpeningHours): boolean => {
    if (openingHours.type === OpeningHoursType.Forbidden) return true;
    if (openingHours.type === OpeningHoursType.Occasionally) return true;
    if (openingHours.type === OpeningHoursType.Unknown) return true;
    return false;
};

const generateHeading = (openingHours: OpeningHours, type: string): string => {
    if (openingHours.type === OpeningHoursType.Unknown) return "Neznámá otevírací doba.";
    const typeCap = capitalizeFirstLetter(type);
    if (openingHours.type === OpeningHoursType.NonStop) return `${typeCap} je volně přístupná.`;
    if (openingHours.type === OpeningHoursType.Forbidden) {
        if (openingHours.forbidden_type === OpeningHoursForbiddenType.Reconstruction) return `${typeCap} je právě v rekonstrukci.`;
        if (openingHours.forbidden_type === OpeningHoursForbiddenType.Temporary) return `${typeCap} je dočasně uzavřena.`;
        return `${typeCap} je označena jako zaniklá.`;
    }
    if (openingHours.type === OpeningHoursType.Occasionally) return `${typeCap} je přístupná pouze příležitostně.`;

    return `${
        openingHours.months?.length === 0
            ? "Celoročně"
            : MONTHS_CZECH.at(openingHours.months ? openingHours.months[0] : 0) +
              " - " +
              MONTHS_CZECH.at(openingHours.months ? openingHours.months[1] : 0)
    } | ${getDaysString(openingHours.days)} | ${openingHours.time_start} - ${openingHours.time_end} h`;
};

function OpeningHours_({ tower, openingHours, children }: { tower?: Tower; openingHours?: OpeningHours; children?: ReactNode }) {
    const OH: OpeningHours = tower ? tower.openingHours : openingHours || { type: 0 };
    return (
        <div
            className={`card card-compact sm:card-normal min-w-[300px] max-w-[calc(min(94vw,420px))] sm:h-[225px] flex-1 overflow-hidden shadow-xl group bg-[rgba(255,255,255,0.05)]`}
        >
            <div className="card-body">
                <h2 className={`card-title text-base sm:text-lg md:text-xl ${isErrorColor(OH) && "text-error"}`}>Otevírací doba</h2>
                <p className={`text-base md:text-lg ${isErrorColor(OH) && "text-error"}`}>{generateHeading(OH, tower?.type || "rozhledna")}</p>
                {OH.lunch_break && <p className={`text-base md:text-lg ${isErrorColor(OH) && "text-error"}`}>{getLunchString(OH)}</p>}
                {OH.note && <p className="text-sm md:text-base">{OH.note}</p>}
            </div>
            {children}
        </div>
    );
}

export default OpeningHours_;
