import assert from "node:assert/strict";
import test from "node:test";

import { AdmissionType } from "@/types/Admission";
import { OpeningHoursForbiddenType, OpeningHoursType } from "@/types/OpeningHours";

import {
    formatIndexedTowerLabel,
    formatUpdateValues,
    formatLogMessage,
    getPreviousUpdateValues,
    getMissingMapyUpdates,
    parseCliOptions,
    stripUtmParameters,
} from "./towers_mapy_sync";

test("formatLogMessage colorizes the script prefix and message", () => {
    assert.equal(
        formatLogMessage("Saved tower", "green"),
        "\u001B[90m[towers_mapy_sync] \u001B[32mSaved tower\u001B[0m"
    );
});

test("formatIndexedTowerLabel includes the stable batch index", () => {
    assert.equal(
        formatIndexedTowerLabel({ id: "tower-1", name: "Rozhledna Test" }, 20),
        "[20] Rozhledna Test (tower-1)"
    );
});

test("parseCliOptions enables auto mode only with --auto", () => {
    assert.equal(parseCliOptions([]).auto, false);
    assert.equal(parseCliOptions(["--auto"]).auto, true);
});

test("stripUtmParameters removes Mapy.com tracking parameters and preserves functional ones", () => {
    assert.equal(
        stripUtmParameters(
            "https://www.horasvatekateriny.cz/?reservation=123&utm_source=mapy.com&utm_medium=ppd&utm_campaign=firmy.cz-1346579"
        ),
        "https://www.horasvatekateriny.cz/?reservation=123"
    );
    assert.equal(stripUtmParameters("not a URL"), "not a URL");
});

test("formatUpdateValues abbreviates only opening-hours ranges", () => {
    assert.equal(
        formatUpdateValues({
            elevation: 798,
            openingHours: {
                ranges: [{ dayFrom: 9, dayTo: 17, days: [1], monthFrom: 0, monthTo: 11 }],
                type: OpeningHoursType.SomeMonths,
            },
        }),
        `{
  "elevation": 798,
  "openingHours": {
    "ranges": (...),
    "type": 3
  }
}`
    );
});

test("getPreviousUpdateValues logs only existing values being updated", () => {
    assert.deepEqual(
        getPreviousUpdateValues(
            {
                elevation: 700,
                openingHours: {
                    ranges: [{ dayFrom: 8, dayTo: 16, days: [1], monthFrom: 0, monthTo: 11 }],
                    type: OpeningHoursType.SomeMonths,
                },
            },
            {
                elevation: 798,
                openingHours: { type: OpeningHoursType.NonStop },
                owner: "Obec Testov",
            }
        ),
        {
            elevation: 700,
            openingHours: {
                ranges: [{ dayFrom: 8, dayTo: 16, days: [1], monthFrom: 0, monthTo: 11 }],
                type: OpeningHoursType.SomeMonths,
            },
        }
    );
});

test("getPreviousUpdateValues hides bare unknown opening hours but retains their details", () => {
    const updates = { openingHours: { type: OpeningHoursType.NonStop } };

    assert.deepEqual(
        getPreviousUpdateValues({ openingHours: { type: OpeningHoursType.Unknown } }, updates),
        {}
    );
    assert.deepEqual(
        getPreviousUpdateValues(
            {
                openingHours: {
                    detailText: "Otevírací dobu je potřeba ověřit.",
                    detailUrl: "https://example.cz/opening-hours",
                    type: OpeningHoursType.Unknown,
                },
            },
            updates
        ),
        {
            openingHours: {
                detailText: "Otevírací dobu je potřeba ověřit.",
                detailUrl: "https://example.cz/opening-hours",
                type: OpeningHoursType.Unknown,
            },
        }
    );
});

test("getMissingMapyUpdates fills missing Mapy.com fields", () => {
    const updates = getMissingMapyUpdates(
        {
            admission: { tariffes: {}, type: AdmissionType.UNKNOWN },
            material: [],
            openingHours: { type: OpeningHoursType.Unknown },
        },
        {
            admission: { tariffes: {}, type: AdmissionType.PAID },
            contact: {
                email: "info@example.cz",
                officialWebsite:
                    "https://www.horasvatekateriny.cz/?utm_source=mapy.com&utm_medium=ppd&utm_campaign=firmy.cz-1346579",
                phone: "",
            },
            elevation: 450,
            height: 24,
            material: ["kov"],
            openingHours: { type: OpeningHoursType.NonStop },
            owner: "Obec Testov",
            stairs: 120,
        }
    );

    assert.deepEqual(updates, {
        admission: { tariffes: {}, type: AdmissionType.PAID },
        contact: {
            email: "info@example.cz",
            officialWebsite: "https://www.horasvatekateriny.cz/",
            phone: "",
        },
        elevation: 450,
        height: 24,
        material: ["kov"],
        openingHours: { type: OpeningHoursType.NonStop },
        owner: "Obec Testov",
        stairs: 120,
    });
});

test("getMissingMapyUpdates preserves a known non-zero height", () => {
    const updates = getMissingMapyUpdates(
        {
            admission: { tariffes: {}, type: AdmissionType.FREE },
            contact: {
                email: "existing@example.cz",
                officialWebsite: "https://existing.example.cz",
                phone: "+420 123 456 789",
            },
            height: 20,
            material: ["dřevo"],
            openingHours: { type: OpeningHoursType.NonStop },
            owner: "Existing owner",
            stairs: 100,
        },
        {
            admission: { tariffes: {}, type: AdmissionType.PAID },
            contact: { email: "info@example.cz", officialWebsite: "", phone: "" },
            height: 24,
            material: ["kov"],
            openingHours: { type: OpeningHoursType.EveryMonth, dayFrom: 9, dayTo: 17 },
            owner: "Mapy owner",
            stairs: 120,
        }
    );

    assert.deepEqual(updates, {
        admission: { tariffes: {}, type: AdmissionType.PAID },
        contact: {
            email: "info@example.cz",
            officialWebsite: "https://existing.example.cz",
            phone: "+420 123 456 789",
        },
        material: ["kov"],
        owner: "Mapy owner",
        stairs: 120,
    });
});

test("getMissingMapyUpdates fills a zero height from Mapy.com", () => {
    const updates = getMissingMapyUpdates({ height: 0 }, { height: 24 });

    assert.deepEqual(updates, { height: 24 });
});

test("getMissingMapyUpdates fills an absent completion date from Mapy.com", () => {
    assert.deepEqual(getMissingMapyUpdates({}, { opened: "2009-01-01T00:00:00.000Z" }), {
        opened: "2009-01-01T00:00:00.000Z",
    });
});

test("getMissingMapyUpdates fills a null completion date from Mapy.com", () => {
    assert.deepEqual(
        getMissingMapyUpdates({ opened: null }, { opened: "2009-01-01T00:00:00.000Z" }),
        { opened: "2009-01-01T00:00:00.000Z" }
    );
});

test("getMissingMapyUpdates preserves an existing completion date", () => {
    assert.deepEqual(
        getMissingMapyUpdates(
            { opened: "2008-01-01T00:00:00.000Z" },
            { opened: "2009-01-01T00:00:00.000Z" }
        ),
        {}
    );
});

test("getMissingMapyUpdates preserves a known elevation", () => {
    assert.deepEqual(getMissingMapyUpdates({ elevation: 798 }, { elevation: 800 }), {});
});

test("getMissingMapyUpdates fills placeholder elevations from Mapy.com", () => {
    for (const elevation of [undefined, null, 0, 1]) {
        assert.deepEqual(getMissingMapyUpdates({ elevation }, { elevation: 800 }), {
            elevation: 800,
        });
    }
});

test("getMissingMapyUpdates ignores unknown and empty scraped values", () => {
    const updates = getMissingMapyUpdates(
        {
            openingHours: { type: OpeningHoursType.Unknown },
        },
        {
            admission: { tariffes: {}, type: AdmissionType.UNKNOWN },
            contact: { email: "", officialWebsite: "", phone: "" },
            material: [],
            openingHours: { type: OpeningHoursType.Unknown },
        }
    );

    assert.deepEqual(updates, {});
});

test("getMissingMapyUpdates preserves opening-hours text when Mapy.com confirms closure", () => {
    const updates = getMissingMapyUpdates(
        {
            openingHours: {
                detailText: "Uzavřeno, rozhledna je v havarijním stavu.",
                forbiddenType: OpeningHoursForbiddenType.Banned,
                forbidden_type: OpeningHoursForbiddenType.Gone,
                type: OpeningHoursType.Forbidden,
            },
        },
        {
            openingHours: {
                forbiddenType: OpeningHoursForbiddenType.Banned,
                type: OpeningHoursType.Forbidden,
            },
        }
    );

    assert.deepEqual(updates, {});
});

test("getMissingMapyUpdates preserves a known opening-hours schedule", () => {
    const updates = getMissingMapyUpdates(
        {
            openingHours: {
                dayFrom: 9,
                dayTo: 17,
                detailText: "Vstup po dohodě se správcem.",
                type: OpeningHoursType.EveryMonth,
            },
        },
        {
            openingHours: {
                dayFrom: 10,
                dayTo: 18,
                type: OpeningHoursType.EveryMonth,
            },
        }
    );

    assert.deepEqual(updates, {});
});

test("getMissingMapyUpdates fills unknown opening hours from Mapy.com", () => {
    assert.deepEqual(
        getMissingMapyUpdates(
            { openingHours: { type: OpeningHoursType.Unknown } },
            { openingHours: { type: OpeningHoursType.NonStop } }
        ),
        { openingHours: { type: OpeningHoursType.NonStop } }
    );
});

test("parseCliOptions accepts indexed batches and rejects invalid values", () => {
    assert.deepEqual(parseCliOptions(["--start-index", "50", "--limit", "10"]), {
        auto: false,
        limit: 10,
        startIndex: 50,
        waitTimeSeconds: 10,
        write: false,
    });
    assert.equal(parseCliOptions(["--write"]).write, true);
    assert.throws(() => parseCliOptions(["--start-index", "-1"]), /non-negative integer/);
    assert.throws(() => parseCliOptions(["--limit", "0"]), /positive integer/);
});
