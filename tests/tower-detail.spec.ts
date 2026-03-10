import { expect, test } from "@playwright/test";

import { expectNoBrowserErrors, trackBrowserErrors } from "./browser-errors";

test("tower detail loads without browser errors", async ({ page }) => {
    const browserErrors = trackBrowserErrors(page);

    const response = await page.goto("/rozhledna/rimska_vez", {
        waitUntil: "domcontentloaded",
    });

    expect(response?.ok()).toBeTruthy();

    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/rozhledna\/rimska_vez$/);
    await expect(page.getByRole("heading", { name: "Římská věž" })).toBeVisible();

    expectNoBrowserErrors(browserErrors);
});

test("tower gallery lightbox renders above navbar with controls", async ({ page }) => {
    const browserErrors = trackBrowserErrors(page);

    await page.goto("/rozhledna/rimska_vez", {
        waitUntil: "domcontentloaded",
    });

    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "Římská věž" })).toBeVisible();

    const galleryImage = page.locator("figure img").first();
    await expect(galleryImage).toBeVisible();
    await galleryImage.click();

    const lightboxPortal = page.locator(".yarl__portal");
    const lightboxImage = page.locator(".yarl__slide_current .yarl__slide_image");
    const toolbarButtons = page.locator(".yarl__toolbar .yarl__button");
    const thumbnails = page.locator(".yarl__thumbnails_container");
    const counter = page.locator(".yarl__counter");

    await expect(lightboxPortal).toBeVisible();
    await expect(lightboxImage).toBeVisible();
    await expect(counter).toBeVisible();
    await expect(thumbnails).toBeVisible();
    await expect(toolbarButtons).toHaveCount(5);

    const [navbarZIndex, portalZIndex] = await Promise.all([
        page
            .locator("div.sticky.top-0")
            .first()
            .evaluate((element) =>
                Number.parseInt(window.getComputedStyle(element).zIndex || "0", 10)
            ),
        lightboxPortal.evaluate((element) =>
            Number.parseInt(window.getComputedStyle(element).zIndex || "0", 10)
        ),
    ]);

    expect(portalZIndex).toBeGreaterThan(navbarZIndex);
    expectNoBrowserErrors(browserErrors);
});
