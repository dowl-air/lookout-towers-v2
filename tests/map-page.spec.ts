import { expect, test } from "@playwright/test";

import { expectNoBrowserErrors, trackBrowserErrors } from "./browser-errors";

test("map page renders Leaflet map without browser errors", async ({ page }) => {
    const browserErrors = trackBrowserErrors(page);

    const response = await page.goto("/mapa", {
        waitUntil: "domcontentloaded",
    });

    expect(response?.ok()).toBeTruthy();

    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/mapa$/);
    await expect(page.getByTestId("leaflet-map-container")).toBeVisible();
    await expect(page.locator(".leaflet-container")).toBeVisible();
    await expect(page.getByRole("button", { name: "Mapová vrstva" })).toBeVisible();

    expectNoBrowserErrors(browserErrors);
});
