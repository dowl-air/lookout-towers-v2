export enum OpeningHoursType {
    Unknown,
    NonStop,
    Occasionally,
    SomeMonths,
    Forbidden,
    WillOpen,
    EveryMonth,
}

export enum OpeningHoursForbiddenType {
    Reconstruction,
    Temporary,
    Gone,
    Banned,
}

export type OpeningHours = {
    type: OpeningHoursType;
    monthFrom?: number;
    monthTo?: number;
    isLockedAtNight?: boolean;
    days?: number[];
    forbiddenType?: OpeningHoursForbiddenType;
    dayFrom?: number;
    dayTo?: number;
    lunchBreak?: boolean;
    lunchFrom?: number;
    lunchTo?: number;
    detailText?: string;
    detailUrl?: string;
};

export const getOpeningHoursTypeName = (type: OpeningHoursType): string => {
    switch (type) {
        case OpeningHoursType.NonStop:
            return "Volně přístupná";
        case OpeningHoursType.Occasionally:
            return "Příležitostně otevřená";
        case OpeningHoursType.SomeMonths:
            return "Pouze některé měsíce";
        case OpeningHoursType.Forbidden:
            return "Nepřístupná";
        case OpeningHoursType.WillOpen:
            return "Před zpřístupněním";
        case OpeningHoursType.EveryMonth:
            return "Otevřeno celoročně";
        default:
            return "Neznámá otevírací doba";
    }
};
