import assert from "node:assert/strict";
import test from "node:test";

import { formatParameterValue, isUnknownParameterValue } from "@/utils/formatValue";

test("formats an explicit numeric zero as a known value", () => {
    assert.equal(formatParameterValue(0, "number"), "0");
    assert.equal(isUnknownParameterValue(0, "number"), false);
});
