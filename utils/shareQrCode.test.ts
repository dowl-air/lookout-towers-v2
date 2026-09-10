import assert from "node:assert/strict";
import test from "node:test";

import { createShareableQrFile } from "@/utils/shareQrCode";

test("creates a shareable PNG file from a QR code data URL", async () => {
    const file = await createShareableQrFile("data:image/png;base64,iVBORw0KGgo=", "qr-platba.png");

    assert.equal(file.name, "qr-platba.png");
    assert.equal(file.type, "image/png");
    assert.equal(file.size, 8);
});
