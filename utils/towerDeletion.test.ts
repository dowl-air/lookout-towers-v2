import assert from "node:assert/strict";
import test from "node:test";

import { isTowerDeletionConfirmed } from "@/utils/towerDeletion";

test("requires the exact tower name to confirm deletion", () => {
    assert.equal(isTowerDeletionConfirmed("Rozhledna Test", "Rozhledna Test"), true);
    assert.equal(isTowerDeletionConfirmed("Rozhledna Test", "rozhledna test"), false);
    assert.equal(isTowerDeletionConfirmed("Rozhledna Test", "Rozhledna Test "), false);
});
