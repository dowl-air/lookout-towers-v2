import "server-only";

import { track } from "@vercel/analytics/server";

type AnalyticsProperties = Record<string, boolean | number | string | null>;

export async function trackAnalyticsEvent(name: string, properties: AnalyticsProperties) {
    try {
        await track(name, properties);
    } catch {
        // Analytics must never prevent a completed user action.
    }
}
