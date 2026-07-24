import assert from "node:assert/strict";
import test from "node:test";

import { TowerTypeEnum } from "@/constants/towerType";
import { OpeningHoursType } from "@/types/OpeningHours";
import { Tower } from "@/types/Tower";
import {
    getCollectionPageJsonLd,
    getMapJsonLd,
    getTowerJsonLd,
    serializeJsonLd,
} from "@/utils/structuredData";

const tower: Tower = {
    country: "CZ",
    created: new Date(),
    elevation: 450,
    gps: { latitude: 49.9, longitude: 14.4 },
    height: 20,
    id: "tower-1",
    mainPhotoUrl: "",
    material: [],
    modified: new Date(),
    name: "Testovací rozhledna",
    nameID: "testovaci-rozhledna",
    openingHours: { type: OpeningHoursType.NonStop },
    stairs: 100,
    type: TowerTypeEnum.ROZHLEDNA,
};

test("adds breadcrumbs and always-open hours without a review snippet to a tower", () => {
    const jsonLd = getTowerJsonLd({
        tower,
        url: "https://www.rozhlednovysvet.cz/rozhledna/testovaci-rozhledna",
        description: "Testovací popis.",
        images: [],
    });

    const attraction = jsonLd["@graph"][0];
    const breadcrumbs = jsonLd["@graph"][1];

    assert.equal("aggregateRating" in attraction, false);
    assert.deepEqual(attraction.openingHoursSpecification, [
        {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ],
            opens: "00:00",
            closes: "23:59",
        },
    ]);
    assert.equal(breadcrumbs["@type"], "BreadcrumbList");
    assert.deepEqual(breadcrumbs.itemListElement, [
        {
            "@type": "ListItem",
            position: 1,
            name: "Domů",
            item: "https://www.rozhlednovysvet.cz/",
        },
        {
            "@type": "ListItem",
            position: 2,
            name: "Rozhledny a vyhlídky",
            item: "https://www.rozhlednovysvet.cz/rozhledny",
        },
        {
            "@type": "ListItem",
            position: 3,
            name: "Testovací rozhledna",
            item: "https://www.rozhlednovysvet.cz/rozhledna/testovaci-rozhledna",
        },
    ]);
});

test("omits seasonal opening hours and review snippets", () => {
    const jsonLd = getTowerJsonLd({
        tower: {
            ...tower,
            openingHours: {
                type: OpeningHoursType.SomeMonths,
                ranges: [
                    {
                        monthFrom: 3,
                        monthTo: 9,
                        days: [0, 1, 2, 3, 4, 5, 6],
                        dayFrom: 9,
                        dayTo: 18,
                    },
                ],
            },
        },
        url: "https://www.rozhlednovysvet.cz/rozhledna/testovaci-rozhledna",
        description: "Testovací popis.",
        images: [],
    });

    const attraction = jsonLd["@graph"][0];

    assert.equal("aggregateRating" in attraction, false);
    assert.equal("openingHoursSpecification" in attraction, false);
});

test("normalizes year-round schedules and lunch breaks into opening specifications", () => {
    const jsonLd = getTowerJsonLd({
        tower: {
            ...tower,
            openingHours: {
                type: OpeningHoursType.EveryMonth,
                ranges: [
                    {
                        monthFrom: 0,
                        monthTo: 11,
                        days: [0, 4],
                        dayFrom: 9.5,
                        dayTo: 18,
                        lunchBreak: true,
                        lunchFrom: 12,
                        lunchTo: 13,
                    },
                ],
            },
        },
        url: "https://www.rozhlednovysvet.cz/rozhledna/testovaci-rozhledna",
        description: "Testovací popis.",
        images: [],
    });

    assert.deepEqual(jsonLd["@graph"][0].openingHoursSpecification, [
        {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Friday"],
            opens: "09:30",
            closes: "12:00",
        },
        {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Friday"],
            opens: "13:00",
            closes: "18:00",
        },
    ]);
});

test("creates page-level structured data for the catalog and map", () => {
    const catalog = getCollectionPageJsonLd({
        url: "https://www.rozhlednovysvet.cz/rozhledny",
        name: "Rozhledny a vyhlídky",
        description: "Katalog míst s výhledem.",
    });
    const map = getMapJsonLd({
        url: "https://www.rozhlednovysvet.cz/mapa",
        name: "Mapa rozhleden a vyhlídek",
        description: "Mapa míst s výhledem.",
        towerCount: 123,
    });

    assert.equal(catalog["@type"], "CollectionPage");
    assert.equal(map["@type"], "Map");
    assert.equal(map.mainEntity?.numberOfItems, 123);
});

test("escapes script-closing text in JSON-LD", () => {
    const serialized = serializeJsonLd({ name: "</script><script>alert(1)</script>" });

    assert.equal(serialized.includes("</script>"), false);
    assert.equal(JSON.parse(serialized).name, "</script><script>alert(1)</script>");
});
