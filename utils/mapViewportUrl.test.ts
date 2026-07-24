import assert from "node:assert/strict";
import test from "node:test";

import { getMapViewportFromSearchParams, withMapViewportSearchParams } from "./mapViewportUrl";

test("reads a valid map viewport from x, y, and z query parameters", () => {
    assert.deepEqual(
        getMapViewportFromSearchParams(new URLSearchParams("x=15.474263&y=49.823757&z=9")),
        {
            center: [49.823757, 15.474263],
            zoom: 9,
        }
    );
});

test("rejects incomplete and out-of-range map viewport parameters", () => {
    assert.equal(getMapViewportFromSearchParams(new URLSearchParams("x=15&y=49")), null);
    assert.equal(getMapViewportFromSearchParams(new URLSearchParams("z=9")), null);
    assert.equal(getMapViewportFromSearchParams(new URLSearchParams("x=181&y=49&z=9")), null);
    assert.equal(getMapViewportFromSearchParams(new URLSearchParams("x=15&y=49&z=19")), null);
});

test("writes map viewport parameters while preserving other query parameters", () => {
    assert.equal(
        withMapViewportSearchParams(new URLSearchParams("includeGone=true"), {
            center: [49.8237572, 15.474263],
            zoom: 9,
        }).toString(),
        "includeGone=true&x=15.474263&y=49.823757&z=9"
    );
});
