import { OpeningHours } from "@/typings";
import { MONTHS_CZECH } from "@/utils/constants";
import React from "react";

const test: OpeningHours = {
    free: true,
    forbidden_gone: false,
    forbidden_reconstruction: false,
    forbidden_temporary: false,
    lunch_break: false,
    lunch_end: 0,
    lunch_start: 0,
    months_all: false,
    months_range: [4, 9],
    occasionally: false,
    occasionally_text: "",
    time_end: 20,
    time_start: 8,
    week_all: false,
    week_some: [],
    unknown: false,
};

function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const generateHeading = (openingHours: OpeningHours, type: string): string => {
    if (openingHours.unknown) return "Neznámá otevírací doba.";
    const typeCap = capitalizeFirstLetter(type);
    if (openingHours.free) return `${typeCap} je volně přístupná.`;
    if (openingHours.forbidden_gone) return `${typeCap} je označena jako zaniklá.`;
    if (openingHours.forbidden_reconstruction) return `${typeCap} je právě v rekonstrukci.`;
    if (openingHours.forbidden_temporary) return `${typeCap} je dočasně uzavřena.`;
    if (openingHours.occasionally) return `${typeCap} je příležitostně přístupná.`;

    return `${
        openingHours.months_all ? "Celoročně" : MONTHS_CZECH.at(openingHours.months_range[0]) + " - " + MONTHS_CZECH.at(openingHours.months_range[1])
    } | ${openingHours.week_all ? "Každý den" : "Po·Út·St·Čt·Pá"} | ${openingHours.time_start} - ${openingHours.time_end} h`;
};

function OpeningHours() {
    return (
        <div
            className={`card card-compact sm:card-normal min-w-[300px] max-w-[420px] sm:h-[225px] flex-1 overflow-hidden shadow-xl group bg-[rgba(255,255,255,0.05)]`}
        >
            <div className="card-body">
                <h2 className="card-title text-xl">Otevírací doba</h2>
                <p className={`text-lg ${test.unknown && "text-error"}`}>{generateHeading(test, "rozhledna")}</p>
            </div>
            <div className="btn btn-warning btn-sm hidden absolute top-[0.1rem] right-[0.5rem] group-hover:inline-flex">Navrhnout úpravu</div>
        </div>
    );
}

export default OpeningHours;
