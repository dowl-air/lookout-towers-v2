import assert from "node:assert/strict";
import test from "node:test";

import { OpeningHoursType } from "@/types/OpeningHours";
import { getOpeningHoursRanges, getOpeningHoursStateAndShortText } from "@/utils/openingHours";

test("preserves the entered order of opening-hour periods", () => {
    const ranges = getOpeningHoursRanges({
        type: OpeningHoursType.SomeMonths,
        ranges: [
            {
                monthFrom: 8,
                monthTo: 10,
                days: [0, 1, 2, 3, 4],
                dayFrom: 9,
                dayTo: 17,
            },
            {
                monthFrom: 4,
                monthTo: 7,
                days: [6],
                dayFrom: 10,
                dayTo: 16,
            },
        ],
    });

    assert.deepEqual(
        ranges.map(({ monthFrom, monthTo }) => ({ monthFrom, monthTo })),
        [
            { monthFrom: 8, monthTo: 10 },
            { monthFrom: 4, monthTo: 7 },
        ]
    );
});

test("uses the supplied date when evaluating opening hours", () => {
    const openingHours = {
        type: OpeningHoursType.EveryMonth,
        ranges: [
            {
                monthFrom: 0,
                monthTo: 11,
                days: [0, 1, 2, 3, 4, 5, 6],
                dayFrom: 9,
                dayTo: 17,
            },
        ],
    };

    assert.deepEqual(
        getOpeningHoursStateAndShortText(openingHours, new Date("2026-09-10T10:00:00")),
        [true, "Otevřeno do 17h"]
    );
    assert.deepEqual(
        getOpeningHoursStateAndShortText(openingHours, new Date("2026-09-10T18:00:00")),
        [false, "Otevírá v pá 9h"]
    );
});
