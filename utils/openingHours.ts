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
            console.log(forbiddenType);

            switch (forbiddenType) {
                case OpeningHoursForbiddenType.Reconstruction:
                    return [false, "Rekonstrukce"];
                case OpeningHoursForbiddenType.Temporary:
                    return [false, "Dočasně uzavřeno"];
                case OpeningHoursForbiddenType.Gone:
                    return [false, "Zaniklá"];
                case OpeningHoursForbiddenType.Banned:
                    return [false, "Nepřístupná"];
                default:
                    return [false, "Nepřístupná"];
            }
        case OpeningHoursType.WillOpen:
            return [false, "Před zpřístupněním"];
        case OpeningHoursType.SomeMonths:
            if (new Date().getMonth() + 1 >= monthFrom && new Date().getMonth() + 1 <= monthTo) {
                if (days.includes(new Date().getDay())) {
                    if (dayFrom <= new Date().getHours() && dayTo >= new Date().getHours()) {
                        return [true, `Otevřeno do ${dayTo}h`];
                    } else {
                        const currentDay = new Date().getDay();
                        const nextDay = days.find((day) => day > currentDay) || days[0];
                        return [false, `Otevírá v ${DAYS_CZECH[nextDay].slice(0, 2)} ${dayFrom}h`];
                    }
                } else {
                    const currentDay = new Date().getDay();
                    const nextDay = days.find((day) => day > currentDay) || days[0];
                    return [false, `Otevírá v ${DAYS_CZECH[nextDay].slice(0, 2)} ${dayFrom}h`];
                }
            }
            return [false, `Otevřeno od ${MONTHS_CZECH_4[monthFrom].toLocaleLowerCase()}`];
        case OpeningHoursType.EveryMonth:
            if (days.includes(new Date().getDay())) {
                if (dayFrom <= new Date().getHours() && dayTo >= new Date().getHours()) {
                    return [true, `Otevřeno do ${dayTo}h`];
                } else {
                    const currentDay = new Date().getDay();
                    const nextDay = days.find((day) => day > currentDay) || days[0];
                    return [false, `Otevírá v ${DAYS_CZECH[nextDay].slice(0, 2)} ${dayFrom}h`];
                }
            } else {
                const currentDay = new Date().getDay();
                const nextDay = days.find((day) => day > currentDay) || days[0];
                return [false, `Otevírá v ${DAYS_CZECH[nextDay].slice(0, 2)} ${dayFrom}h`];
            }
        default:
            return [false, ""];
    }
};
