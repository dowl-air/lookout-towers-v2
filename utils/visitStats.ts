const PRAGUE_TIME_ZONE = "Europe/Prague";

type VisitDateStats = {
    longestStreak: number;
    mostActiveMonth: string | null;
    mostActiveMonthCount: number;
    mostVisitsDay: string | null;
    mostVisitsDayCount: number;
    visitsThisYear: number;
};

const getDateParts = (date: Date) => {
    const parts = new Intl.DateTimeFormat("en-CA", {
        day: "2-digit",
        month: "2-digit",
        timeZone: PRAGUE_TIME_ZONE,
        year: "numeric",
    }).formatToParts(date);

    return Object.fromEntries(parts.map((part) => [part.type, part.value]));
};

const getCalendarDay = (date: Date): string => {
    const { day, month, year } = getDateParts(date);
    return `${year}-${month}-${day}`;
};

const getCalendarMonth = (date: Date): string => {
    const { month, year } = getDateParts(date);
    return `${year}-${month}`;
};

const getHighestCount = (counts: Map<string, number>): [string | null, number] =>
    [...counts.entries()].reduce(
        (highest, entry) =>
            entry[1] > highest[1] || (entry[1] === highest[1] && entry[0] < (highest[0] || ""))
                ? entry
                : highest,
        [null, 0] as [string | null, number]
    );

const getLongestStreak = (calendarDays: string[]): number => {
    const sortedDays = [...new Set(calendarDays)].sort();
    let longestStreak = 0;
    let currentStreak = 0;
    let previousDayTimestamp: number | null = null;

    sortedDays.forEach((calendarDay) => {
        const timestamp = Date.parse(`${calendarDay}T00:00:00.000Z`);
        currentStreak =
            previousDayTimestamp === null || timestamp - previousDayTimestamp !== 86_400_000
                ? 1
                : currentStreak + 1;
        longestStreak = Math.max(longestStreak, currentStreak);
        previousDayTimestamp = timestamp;
    });

    return longestStreak;
};

export const getVisitDateStats = (visitDates: string[], now = new Date()): VisitDateStats => {
    const visitsByDay = new Map<string, number>();
    const visitsByMonth = new Map<string, number>();
    const currentYear = getDateParts(now).year;
    let visitsThisYear = 0;

    visitDates.forEach((visitDate) => {
        const date = new Date(visitDate);
        if (Number.isNaN(date.getTime())) {
            return;
        }

        const calendarDay = getCalendarDay(date);
        const calendarMonth = getCalendarMonth(date);
        visitsByDay.set(calendarDay, (visitsByDay.get(calendarDay) || 0) + 1);
        visitsByMonth.set(calendarMonth, (visitsByMonth.get(calendarMonth) || 0) + 1);

        if (calendarDay.startsWith(`${currentYear}-`)) {
            visitsThisYear++;
        }
    });

    const [mostVisitsDayKey, mostVisitsDayCount] = getHighestCount(visitsByDay);
    const [mostActiveMonthKey, mostActiveMonthCount] = getHighestCount(visitsByMonth);
    const mostVisitsDay = mostVisitsDayKey
        ? new Date(`${mostVisitsDayKey}T12:00:00.000Z`).toLocaleDateString("cs", {
              timeZone: PRAGUE_TIME_ZONE,
          })
        : null;
    const mostActiveMonth = mostActiveMonthKey
        ? new Date(`${mostActiveMonthKey}-01T12:00:00.000Z`).toLocaleDateString("cs", {
              month: "long",
              timeZone: PRAGUE_TIME_ZONE,
              year: "numeric",
          })
        : null;

    return {
        longestStreak: getLongestStreak([...visitsByDay.keys()]),
        mostActiveMonth,
        mostActiveMonthCount,
        mostVisitsDay,
        mostVisitsDayCount,
        visitsThisYear,
    };
};
