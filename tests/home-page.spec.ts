import { expect, test } from "@playwright/test";

import { expectNoBrowserErrors, trackBrowserErrors } from "./browser-errors";

test("home page loads without browser errors", async ({ page }) => {
    const browserErrors = trackBrowserErrors(page);

    const response = await page.goto("/", {
        waitUntil: "domcontentloaded",
    });

    expect(response?.ok()).toBeTruthy();

    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText("Rozhledny, věže a vyhlídky", { exact: true })).toBeVisible();
    await expect(
        page.getByText(
            "Vývoj na tomto webu stále probíhá a v současnosti je spuštěn ve zkušebním režimu.",
            {
                exact: true,
            }
        )
    ).toBeVisible();

    expectNoBrowserErrors(browserErrors);
});
