import {
    OpeningHours,
    OpeningHoursForbiddenType,
    OpeningHoursRange,
    OpeningHoursType,
} from "@/types/OpeningHours";
import { DAYS_CZECH, MONTHS_CZECH_4 } from "@/utils/constants";

const FIRST_MONTH = 0;
const LAST_MONTH = 11;
const FIRST_WEEKDAY = 0;
const LAST_WEEKDAY = 6;

const isOpeningHoursTypeWithRanges = (type: OpeningHoursType): boolean =>
    type === OpeningHoursType.SomeMonths || type === OpeningHoursType.EveryMonth;

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

const getCurrentWeekday = (date = new Date()): number => {
    return (date.getDay() + 6) % 7;
};

export const formatOpeningHour = (hour: number): string => {
    if (Number.isInteger(hour)) return `${hour}`;

    const hours = Math.floor(hour);
    const minutes = Math.round((hour - hours) * 60);
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
};

export const createDefaultOpeningHoursRange = (): OpeningHoursRange => ({
    monthFrom: FIRST_MONTH,
    monthTo: LAST_MONTH,
    days: [...Array(7).keys()],
    dayFrom: 9,
    dayTo: 18,
});

const isValidMonth = (month: number): boolean =>
    Number.isInteger(month) && month >= FIRST_MONTH && month <= LAST_MONTH;

const isValidWeekday = (day: number): boolean =>
    Number.isInteger(day) && day >= FIRST_WEEKDAY && day <= LAST_WEEKDAY;

const isRangeComplete = (range: Partial<OpeningHoursRange>): range is OpeningHoursRange => {
    return (
        typeof range.monthFrom === "number" &&
        typeof range.monthTo === "number" &&
        Array.isArray(range.days) &&
        typeof range.dayFrom === "number" &&
        typeof range.dayTo === "number"
    );
};

export const getOpeningHoursRanges = (openingHours: OpeningHours): OpeningHoursRange[] => {
    if (Array.isArray(openingHours.ranges) && openingHours.ranges.length > 0) {
        return [...openingHours.ranges].sort((rangeA, rangeB) => {
            if (rangeA.monthFrom !== rangeB.monthFrom) return rangeA.monthFrom - rangeB.monthFrom;
            return rangeA.monthTo - rangeB.monthTo;
        });
    }

    if (!isOpeningHoursTypeWithRanges(openingHours.type)) return [];

    const monthFrom =
        openingHours.type === OpeningHoursType.EveryMonth ? FIRST_MONTH : openingHours.monthFrom;
    const monthTo =
        openingHours.type === OpeningHoursType.EveryMonth ? LAST_MONTH : openingHours.monthTo;
    const range = {
        monthFrom,
        monthTo,
        days: openingHours.days,
        dayFrom: openingHours.dayFrom,
        dayTo: openingHours.dayTo,
        lunchBreak: openingHours.lunchBreak,
        lunchFrom: openingHours.lunchFrom,
        lunchTo: openingHours.lunchTo,
    };

    return isRangeComplete(range) ? [range] : [];
};

export const normalizeOpeningHours = (openingHours: OpeningHours): OpeningHours => {
    if (!openingHours) return { type: OpeningHoursType.Unknown };

    if (!isOpeningHoursTypeWithRanges(openingHours.type)) return openingHours;

    const ranges = getOpeningHoursRanges(openingHours);
    return {
        ...openingHours,
        type: getOpeningHoursTypeFromRanges(ranges),
        ranges,
    };
};

export const getOpeningHoursTypeFromRanges = (ranges: OpeningHoursRange[]): OpeningHoursType => {
    const coveredMonths = new Set<number>();

    ranges.forEach((range) => {
        for (let month = range.monthFrom; month <= range.monthTo; month += 1) {
            coveredMonths.add(month);
        }
    });

    return coveredMonths.size === 12 ? OpeningHoursType.EveryMonth : OpeningHoursType.SomeMonths;
};

export const isValidOpeningHoursUrl = (url: string): boolean => {
    if (!url) return true;

    try {
        const parsedUrl = new URL(url);
        const isAllowedProtocol = parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:";
        const hasPublicHostname =
            parsedUrl.hostname.includes(".") && !parsedUrl.hostname.includes(" ");

        return isAllowedProtocol && hasPublicHostname;
    } catch {
        return false;
    }
};

const getRangeValidationError = (range: OpeningHoursRange, idx: number): string | null => {
    const prefix = `Období ${idx + 1}`;

    if (!isValidMonth(range.monthFrom)) return `${prefix}: není vybrán měsíc od.`;
    if (!isValidMonth(range.monthTo)) return `${prefix}: není vybrán měsíc do.`;
    if (range.monthTo < range.monthFrom)
        return `${prefix}: měsíc do musí být stejný nebo pozdější než měsíc od.`;
    if (!Array.isArray(range.days) || range.days.length === 0)
        return `${prefix}: není vybrán žádný den.`;
    if (
        new Set(range.days).size !== range.days.length ||
        range.days.some((day) => !isValidWeekday(day))
    )
        return `${prefix}: obsahuje neplatný den.`;
    if (range.dayFrom === undefined || range.dayFrom < 0)
        return `${prefix}: není vybrán začátek otevírací doby.`;
    if (range.dayTo === undefined || range.dayTo < 0)
        return `${prefix}: není vybrán konec otevírací doby.`;
    if (range.dayTo <= range.dayFrom)
        return `${prefix}: otevírací doba musí začínat dříve, než končit.`;

    if (range.lunchBreak) {
        if (range.lunchFrom === undefined || range.lunchFrom < 0)
            return `${prefix}: není vybrán začátek přestávky.`;
        if (range.lunchTo === undefined || range.lunchTo < 0)
            return `${prefix}: není vybrán konec přestávky.`;
        if (range.lunchFrom <= range.dayFrom)
            return `${prefix}: přestávka začíná dříve než otevírací doba.`;
        if (range.lunchFrom >= range.dayTo)
            return `${prefix}: přestávka začíná později než otevírací doba.`;
        if (range.lunchTo >= range.dayTo)
            return `${prefix}: přestávka končí později, než končí otevírací doba.`;
        if (range.lunchTo <= range.dayFrom)
            return `${prefix}: přestávka končí dříve, než začne otevírací doba.`;
        if (range.lunchTo <= range.lunchFrom)
            return `${prefix}: přestávka musí začínat dříve, než končit.`;
    }

    return null;
};

const haveOverlappingMonths = (ranges: OpeningHoursRange[]): boolean => {
    const usedMonths = new Set<number>();

    for (const range of ranges) {
        for (let month = range.monthFrom; month <= range.monthTo; month += 1) {
            if (usedMonths.has(month)) return true;
            usedMonths.add(month);
        }
    }

    return false;
};

export const getOpeningHoursValidationError = (openingHours: OpeningHours): string | null => {
    if (!isValidOpeningHoursUrl(openingHours.detailUrl ?? "")) {
        return "URL adresa musí být platný odkaz začínající http:// nebo https://.";
    }

    if (!isOpeningHoursTypeWithRanges(openingHours.type)) return null;

    const ranges = getOpeningHoursRanges(openingHours);

    if (ranges.length === 0) return "Není přidané žádné období.";

    for (let idx = 0; idx < ranges.length; idx += 1) {
        const error = getRangeValidationError(ranges[idx], idx);
        if (error) return error;
    }

    if (haveOverlappingMonths(ranges)) return "Jednotlivá období se nesmí překrývat.";

    return null;
};

const getActiveRange = (
    ranges: OpeningHoursRange[],
    date = new Date()
): OpeningHoursRange | undefined => {
    const currentMonth = date.getMonth();
    const currentDay = getCurrentWeekday(date);

    return ranges.find(
        (range) =>
            range.monthFrom <= currentMonth &&
            range.monthTo >= currentMonth &&
            range.days.includes(currentDay)
    );
};

const getCurrentTime = (date = new Date()): number => date.getHours() + date.getMinutes() / 60;

const getNextOpenRange = (
    ranges: OpeningHoursRange[],
    date = new Date()
): { date: Date; range: OpeningHoursRange } | null => {
    const startDate = new Date(date);

    for (let offset = 0; offset < 370; offset += 1) {
        const testDate = new Date(startDate);
        testDate.setDate(startDate.getDate() + offset);

        const range = getActiveRange(ranges, testDate);
        if (!range) continue;

        if (offset === 0 && getCurrentTime(date) >= range.dayFrom) continue;

        return { date: testDate, range };
    }

    return null;
};

export const getOpeningHoursStateAndShortText = (openingHours: OpeningHours): [boolean, string] => {
    const { type, isLockedAtNight, forbiddenType } = openingHours;
    switch (type) {
        case OpeningHoursType.NonStop:
            if (isLockedAtNight) {
                const isNight = new Date().getHours() < 7 || new Date().getHours() > 20;
                return [!isNight, isNight ? "Otevírá ráno" : "Otevřeno do večera"];
            }
            return [true, "Volně přístupná"];
        case OpeningHoursType.Occasionally:
            return [false, "Příležitostně otevřená"];
        case OpeningHoursType.Forbidden:
            switch (forbiddenType) {
                case OpeningHoursForbiddenType.Reconstruction:
                    return [false, "Rekonstrukce"];
                case OpeningHoursForbiddenType.Temporary:
                    return [false, "Dočasně uzavřeno"];
                case OpeningHoursForbiddenType.Gone:
                    return [false, "Zaniklá"];
                case OpeningHoursForbiddenType.Banned:
                    return [false, "Uzavřeno"];
                default:
                    return [false, "Nepřístupná"];
            }
        case OpeningHoursType.WillOpen:
            return [false, "Před zpřístupněním"];
        case OpeningHoursType.SomeMonths:
        case OpeningHoursType.EveryMonth:
            const ranges = getOpeningHoursRanges(openingHours);
            const activeRange = getActiveRange(ranges);

            if (activeRange) {
                const currentTime = getCurrentTime();
                const isLunchBreak =
                    activeRange.lunchBreak &&
                    currentTime >= activeRange.lunchFrom &&
                    currentTime < activeRange.lunchTo;

                if (isLunchBreak)
                    return [false, `Pauza do ${formatOpeningHour(activeRange.lunchTo)}h`];
                if (currentTime >= activeRange.dayFrom && currentTime < activeRange.dayTo) {
                    return [true, `Otevřeno do ${formatOpeningHour(activeRange.dayTo)}h`];
                }
            }

            const nextOpenRange = getNextOpenRange(ranges);
            if (nextOpenRange) {
                const nextDay = getCurrentWeekday(nextOpenRange.date);
                return [
                    false,
                    `Otevírá v ${DAYS_CZECH[nextDay].slice(0, 2)} ${formatOpeningHour(nextOpenRange.range.dayFrom)}h`,
                ];
            }

            if (ranges[0])
                return [
                    false,
                    `Otevřeno od ${MONTHS_CZECH_4[ranges[0].monthFrom].toLocaleLowerCase()}`,
                ];
            return [false, "Otevírací doba neuvedena"];
        default:
            return [false, ""];
    }
};
