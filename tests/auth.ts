import { expect, type Page } from "@playwright/test";

export const authenticateAsTestUser = async (page: Page) => {
    const response = await page.context().request.post("/api/test-auth/login");

    expect(response.ok()).toBeTruthy();
};
