import assert from "node:assert/strict";
import test from "node:test";

import { getCanonicalTowerPath, isCanonicalTowerType } from "@/utils/towerRoute";

test("uses the tower's current type for its canonical path", () => {
    const tower = { nameID: "hlaska_rosenberg", type: "vyhlidka" };

    assert.equal(getCanonicalTowerPath(tower), "/vyhlidka/hlaska_rosenberg");
    assert.equal(isCanonicalTowerType("vyhlidka", tower), true);
    assert.equal(isCanonicalTowerType("rozhledna", tower), false);
});
