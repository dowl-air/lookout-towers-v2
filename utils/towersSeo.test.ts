import assert from "node:assert/strict";
import test from "node:test";

import { shouldNoIndexTowersCatalog } from "@/utils/towersSeo";

test("indexes only the unfiltered catalog and its first-page duplicate", () => {
    assert.equal(shouldNoIndexTowersCatalog({}), false);
    assert.equal(shouldNoIndexTowersCatalog({ page: "1" }), false);
    assert.equal(shouldNoIndexTowersCatalog({ page: "2" }), true);
    assert.equal(shouldNoIndexTowersCatalog({ query: "hláska" }), true);
    assert.equal(shouldNoIndexTowersCatalog({ sort: "height_desc" }), true);
    assert.equal(shouldNoIndexTowersCatalog({ location: "50.1,14.4" }), true);
    assert.equal(shouldNoIndexTowersCatalog({ country: "CZ", province: "PR" }), true);
});
