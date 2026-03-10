import { expect, type Page } from "@playwright/test";

export const trackBrowserErrors = (page: Page) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on("console", (message) => {
        if (message.type() === "error") {
            consoleErrors.push(message.text());
        }
    });

    page.on("pageerror", (error) => {
        pageErrors.push(error.message);
    });

    return { consoleErrors, pageErrors };
};

export const expectNoBrowserErrors = ({
    consoleErrors,
    pageErrors,
}: {
    consoleErrors: string[];
    pageErrors: string[];
}) => {
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
};
