import { expect, test } from "@playwright/test";

import { expectNoBrowserErrors, trackBrowserErrors } from "./browser-errors";

test("towers page updates results when province and county filters change", async ({ page }) => {
    const browserErrors = trackBrowserErrors(page);

    const response = await page.goto("/rozhledny", {
        waitUntil: "domcontentloaded",
    });

    expect(response?.ok()).toBeTruthy();

    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "Rozhledny a vyhlídky" })).toBeVisible();

    const resultTitles = page.locator("h2.card-title");
    await expect(resultTitles.first()).toBeVisible();

    const initialResults = await resultTitles.evaluateAll((elements) =>
        elements.slice(0, 5).map((element) => element.textContent?.trim() ?? "")
    );

    await page.getByLabel("Kraj").selectOption("US");
    await expect(page).toHaveURL(/province=US/);
    await expect(page).toHaveURL(/country=CZ/);

    await page.getByLabel("Okres").selectOption("Most");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/province=US/);
    await expect(page).toHaveURL(/country=CZ/);
    await expect(page).toHaveURL(/county=Most/);
    await expect(page.getByLabel("Kraj")).toHaveValue("US");
    await expect(page.getByLabel("Okres")).toHaveValue("Most");
    await expect(resultTitles.first()).toBeVisible();

    const filteredResults = await resultTitles.evaluateAll((elements) =>
        elements.slice(0, 5).map((element) => element.textContent?.trim() ?? "")
    );

    expect(filteredResults.length).toBeGreaterThan(0);
    expect(filteredResults).not.toEqual(initialResults);
    expectNoBrowserErrors(browserErrors);
});

test("towers page search changes the shown results", async ({ page }) => {
    const browserErrors = trackBrowserErrors(page);

    const response = await page.goto("/rozhledny", {
        waitUntil: "domcontentloaded",
    });

    expect(response?.ok()).toBeTruthy();

    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "Rozhledny a vyhlídky" })).toBeVisible();

    const resultTitles = page.locator("h2.card-title");
    const searchInput = page.getByPlaceholder("Vyhledat rozhlednu");

    await expect(resultTitles.first()).toBeVisible();
    const initialResults = await resultTitles.evaluateAll((elements) =>
        elements.slice(0, 5).map((element) => element.textContent?.trim() ?? "")
    );

    await searchInput.fill("Akátová");
    await expect.poll(() => page.url()).toContain("query=Ak%C3%A1tov%C3%A1");
    await page.waitForLoadState("networkidle");

    await expect(searchInput).toHaveValue("Akátová");
    await expect(resultTitles.first()).toBeVisible();
    await expect(resultTitles.first()).toContainText("Akátová věž");

    const searchedResults = await resultTitles.evaluateAll((elements) =>
        elements.slice(0, 5).map((element) => element.textContent?.trim() ?? "")
    );

    expect(searchedResults.length).toBeGreaterThan(0);
    expect(searchedResults).not.toEqual(initialResults);
    expectNoBrowserErrors(browserErrors);
});
