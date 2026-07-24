import assert from "node:assert/strict";
import test from "node:test";

import { OpeningHoursForbiddenType, OpeningHoursType } from "@/types/OpeningHours";

import {
    filterPermanentlyUnavailableTowers,
    filterMapTowers,
    getMapTowerPersonalStatuses,
    toggleExclusiveMapUserFilter,
} from "./mapTowerFilters";

const activeTower = {
    id: "active",
    isFavourite: false,
    isVisited: false,
    openingHours: { type: OpeningHoursType.NonStop },
};

const goneTower = {
    id: "gone",
    isFavourite: false,
    isVisited: false,
    openingHours: {
        type: OpeningHoursType.Forbidden,
        forbiddenType: OpeningHoursForbiddenType.Gone,
    },
};

const permanentlyClosedTower = {
    id: "permanently-closed",
    isFavourite: false,
    isVisited: false,
    openingHours: {
        type: OpeningHoursType.Forbidden,
        forbiddenType: OpeningHoursForbiddenType.Banned,
    },
};

test("hides discontinued and permanently closed towers by default", () => {
    const towers = filterMapTowers([activeTower, goneTower, permanentlyClosedTower], {
        includeGone: false,
        onlyFavourites: false,
        onlyVisited: false,
    });

    assert.deepEqual(
        towers.map((tower) => tower.id),
        ["active"]
    );
});

test("shows discontinued and permanently closed towers when explicitly included", () => {
    const towers = filterMapTowers([activeTower, goneTower, permanentlyClosedTower], {
        includeGone: true,
        onlyFavourites: false,
        onlyVisited: false,
    });

    assert.deepEqual(
        towers.map((tower) => tower.id),
        ["active", "gone", "permanently-closed"]
    );
});

test("keeps personally visited and favourite discontinued towers visible", () => {
    const towers = filterMapTowers(
        [
            goneTower,
            { ...goneTower, id: "visited-gone", isVisited: true },
            { ...goneTower, id: "favourite-gone", isFavourite: true },
        ],
        {
            includeGone: false,
            onlyFavourites: false,
            onlyVisited: false,
        }
    );

    assert.deepEqual(
        towers.map((tower) => tower.id),
        ["visited-gone", "favourite-gone"]
    );
});

test("excludes discontinued and permanently closed towers from nearby candidates", () => {
    const towers = filterPermanentlyUnavailableTowers([
        activeTower,
        goneTower,
        permanentlyClosedTower,
    ]);

    assert.deepEqual(
        towers.map((tower) => tower.id),
        ["active"]
    );
});

test("makes visited and favourite-only filters mutually exclusive", () => {
    assert.deepEqual(
        toggleExclusiveMapUserFilter(
            { onlyFavourites: true, onlyVisited: false },
            "onlyVisited",
            true
        ),
        { onlyFavourites: false, onlyVisited: true }
    );

    assert.deepEqual(
        toggleExclusiveMapUserFilter(
            { onlyFavourites: false, onlyVisited: true },
            "onlyFavourites",
            true
        ),
        { onlyFavourites: true, onlyVisited: false }
    );
});

test("maps profile tower states to independent marker badges", () => {
    assert.deepEqual(
        getMapTowerPersonalStatuses({
            isFavourite: true,
            isRated: true,
            isVisited: true,
        }),
        { isFavourite: true, isRated: true, isVisited: true }
    );

    assert.deepEqual(getMapTowerPersonalStatuses({ isFavourite: false, isVisited: false }), {
        isFavourite: false,
        isRated: false,
        isVisited: false,
    });
});
