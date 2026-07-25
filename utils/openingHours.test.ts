import assert from "node:assert/strict";
import test from "node:test";

import { OpeningHoursType } from "@/types/OpeningHours";
import { getOpeningHoursRanges } from "@/utils/openingHours";

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
