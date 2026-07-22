import assert from "node:assert/strict";
import test from "node:test";

import { TowerTypeEnum } from "@/constants/towerType";
import { OpeningHoursType } from "@/types/OpeningHours";
import { getTowerSeoDescription } from "@/utils/towerDescriptions";

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
