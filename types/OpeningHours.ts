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
