import { expect, test } from "@playwright/test";

import { expectNoBrowserErrors, trackBrowserErrors } from "./browser-errors";

test("signin page renders provider buttons without browser errors", async ({ page }) => {
    const browserErrors = trackBrowserErrors(page);

    const response = await page.goto("/signin", {
        waitUntil: "domcontentloaded",
    });

    expect(response?.ok()).toBeTruthy();

    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/signin$/);
    await expect(page.getByRole("heading", { name: "Rozhlednový svět" })).toBeVisible();

    const providerButtons = page.getByRole("button", {
        name: /Přihlásit se pomocí/i,
    });

    await expect(providerButtons.first()).toBeVisible();
    await expect(providerButtons).toHaveCount(2);

    expectNoBrowserErrors(browserErrors);
});
