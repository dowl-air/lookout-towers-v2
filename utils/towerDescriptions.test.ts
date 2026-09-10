import assert from "node:assert/strict";
import test from "node:test";

import { TowerTypeEnum } from "@/constants/towerType";
import { OpeningHoursType } from "@/types/OpeningHours";
import {
    getTowerFactDescription,
    getTowerSeoDescription,
    getTowerSeoFallbackDescription,
} from "@/utils/towerDescriptions";

test("distinguishes explicit zero facts from missing tower facts", () => {
    const baseTower = {
        openingHours: { type: OpeningHoursType.Unknown },
        type: TowerTypeEnum.ROZHLEDNA,
    };

    assert.equal(
        getTowerSeoFallbackDescription({ ...baseTower, elevation: 0, height: 0, stairs: 0 }),
        "Rozhledna se nachází na úrovni terénu a nemá žádné schody. Nachází se v nadmořské výšce 0 metrů a má neznámou otevírací dobu."
    );
    assert.equal(
        getTowerSeoFallbackDescription(baseTower),
        "Rozhledna má neznámou výšku a má neznámý počet schodů. Má neznámou nadmořskou výšku a má neznámou otevírací dobu."
    );
});

test("generates the shared factual description for tower surfaces", () => {
    assert.equal(
        getTowerFactDescription(
            {
                name: "Klatovská hůrka",
                type: TowerTypeEnum.ROZHLEDNA,
                opened: "1886-01-01",
                material: ["zdivo"],
            },
            "Otevírá v pá 15h"
        ),
        "Klatovská hůrka je rozhledna postavená roku 1886 ze zdiva. Otevírá v pá 15h."
    );
});

test("keeps observation decks and opening hours as separate sentences", () => {
    assert.equal(
        getTowerFactDescription(
            {
                name: "Testovací věž",
                type: TowerTypeEnum.ROZHLEDNA,
                material: ["kov"],
                observationDecksCount: 1,
            },
            "Otevřeno do 17h"
        ),
        "Testovací věž je rozhledna z kovu. Má 1 vyhlídkovou plošinu. Otevřeno do 17h."
    );
});

test("prefers SEO and history descriptions before the generated hero description", () => {
    const towerFacts = {
        elevation: 250,
        height: 20,
        openingHours: { type: OpeningHoursType.Unknown },
        stairs: 100,
        type: TowerTypeEnum.ROZHLEDNA,
    };

    assert.equal(
        getTowerSeoDescription({
            ...towerFacts,
            history: "Historický popis.",
            texts: {
                heroDescription: "Hero popis.",
                seoDescription: "SEO popis.",
            },
        }),
        "SEO popis."
    );

    assert.equal(
        getTowerSeoDescription({
            ...towerFacts,
            history: "Historický popis.",
            texts: { heroDescription: "Hero popis." },
        }),
        "Historický popis."
    );

    assert.equal(
        getTowerSeoDescription({
            ...towerFacts,
            history: "  ",
            texts: { heroDescription: "  Hero popis.  " },
        }),
        "Hero popis."
    );

    assert.equal(
        getTowerSeoDescription({
            ...towerFacts,
            history: "  ",
            texts: { heroDescription: "  " },
        }),
        "Rozhledna je vysoká 20 metrů a má 100 schodů. Nachází se v nadmořské výšce 250 metrů a má neznámou otevírací dobu."
    );
});
