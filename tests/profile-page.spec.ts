import { expect, test } from "@playwright/test";

import { authenticateAsTestUser } from "./auth";
import { expectNoBrowserErrors, trackBrowserErrors } from "./browser-errors";

test("profile page loads for an authenticated test user", async ({ page }) => {
    test.slow();

    const browserErrors = trackBrowserErrors(page);

    await authenticateAsTestUser(page);

    const response = await page.goto("/profil", {
        waitUntil: "domcontentloaded",
    });

    expect(response?.ok()).toBeTruthy();

    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/profil$/);
    await expect(page.getByRole("heading", { name: "Playwright User" })).toBeVisible();
    await expect(page.getByText("Návštěvy", { exact: true })).toBeVisible();
    await expect(page.getByText("Oblíbené", { exact: true })).toBeVisible();
    await expect(page.getByTestId("leaflet-map-container")).toBeVisible();

    expectNoBrowserErrors(browserErrors);
});
