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

export type OpeningHoursRange = {
    monthFrom: number;
    monthTo: number;
    days: number[];
    dayFrom: number;
    dayTo: number;
    lunchBreak?: boolean;
    lunchFrom?: number;
    lunchTo?: number;
};

export type OpeningHours = {
    type: OpeningHoursType;
    ranges?: OpeningHoursRange[];
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
