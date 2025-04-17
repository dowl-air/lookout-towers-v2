import { OpeningHours, OpeningHoursForbiddenType, OpeningHoursType } from "@/types/OpeningHours";
import { DAYS_CZECH, MONTHS_CZECH_4 } from "@/utils/constants";

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

const isCurentMonthOpen = (openingHours: OpeningHours): boolean => {
    const { monthFrom, monthTo } = openingHours;
    const currentMonth = new Date().getMonth();
    return currentMonth >= monthFrom && currentMonth <= monthTo;
};

const isCurrentDayOpen = (openingHours: OpeningHours): boolean => {
    const { days } = openingHours;
    const currentDay = new Date().getDay();
    return days.includes(currentDay);
};

const isCurrentHourOpen = (openingHours: OpeningHours): boolean => {
    const { dayFrom, dayTo } = openingHours;
    const currentHour = new Date().getHours();
    return currentHour >= dayFrom && currentHour <= dayTo;
};

const getNextOpenDay = (openingHours: OpeningHours): number => {
    const { days } = openingHours;
    const currentDay = new Date().getDay();
    return days.find((day) => day > currentDay) || days[0];
};

export const getOpeningHoursStateAndShortText = (openingHours: OpeningHours): [boolean, string] => {
    const { type, monthFrom, monthTo, isLockedAtNight, forbiddenType, dayFrom, dayTo, days } = openingHours;
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
            if (isCurentMonthOpen(openingHours)) {
                if (isCurrentDayOpen(openingHours)) {
                    // today is open
                    if (isCurrentHourOpen(openingHours)) {
                        return [true, `Otevřeno do ${dayTo}h`];
                    } else {
                        const nextDay = getNextOpenDay(openingHours);
                        return [false, `Otevírá v ${DAYS_CZECH[nextDay].slice(0, 2)} ${dayFrom}h`];
                    }
                } else {
                    // this month is open, but not today
                    const nextDay = getNextOpenDay(openingHours);
                    return [false, `Otevírá v ${DAYS_CZECH[nextDay].slice(0, 2)} ${dayFrom}h`];
                }
            } else {
                // from which month is it open
                return [false, `Otevřeno od ${MONTHS_CZECH_4[monthFrom].toLocaleLowerCase()}`];
            }

        case OpeningHoursType.EveryMonth:
            if (isCurrentDayOpen(openingHours)) {
                // today is open
                if (isCurrentHourOpen(openingHours)) {
                    return [true, `Otevřeno do ${dayTo}h`];
                } else {
                    const nextDay = getNextOpenDay(openingHours);
                    return [false, `Otevírá v ${DAYS_CZECH[nextDay].slice(0, 2)} ${dayFrom}h`];
                }
            } else {
                // this month is open, but not today
                const nextDay = getNextOpenDay(openingHours);
                return [false, `Otevírá v ${DAYS_CZECH[nextDay].slice(0, 2)} ${dayFrom}h`];
            }
        default:
            return [false, ""];
    }
};
