import { NextRequest, NextResponse } from "next/server";

import { getTowerByID } from "@/data/tower/towers";
import { trackAnalyticsEvent } from "@/utils/analytics.server";

const DIRECTION_PROVIDERS = new Set(["google-maps", "mapy", "waze"]);

function getDirectionUrl(provider: string, latitude: number, longitude: number) {
    switch (provider) {
        case "google-maps":
            return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        case "mapy":
            return `https://mapy.com/fnc/v1/route?mapset=outdoor&end=${longitude},${latitude}`;
        case "waze":
            return `https://waze.com/ul?ll=${latitude}%2C${longitude}&navigate=yes`;
        default:
            return null;
    }
}

function isHttpUrl(value: string) {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

export async function GET(request: NextRequest) {
    const towerId = request.nextUrl.searchParams.get("towerId");
    const type = request.nextUrl.searchParams.get("type");

    if (!towerId || (type !== "directions" && type !== "official-website")) {
        return new NextResponse(null, { status: 400 });
    }

    const tower = await getTowerByID(towerId);
    if (!tower) {
        return new NextResponse(null, { status: 404 });
    }

    if (type === "directions") {
        const provider = request.nextUrl.searchParams.get("provider");
        if (!provider || !DIRECTION_PROVIDERS.has(provider)) {
            return new NextResponse(null, { status: 400 });
        }

        const destination = getDirectionUrl(provider, tower.gps.latitude, tower.gps.longitude);
        if (!destination) {
            return new NextResponse(null, { status: 400 });
        }

        await trackAnalyticsEvent("Directions opened", {
            provider,
            source: "tower-detail",
            towerType: tower.type,
        });

        return NextResponse.redirect(destination);
    }

    const destination = tower.contact?.officialWebsite;
    if (!destination || !isHttpUrl(destination)) {
        return new NextResponse(null, { status: 404 });
    }

    await trackAnalyticsEvent("External website opened", { source: "tower-detail" });
    return NextResponse.redirect(destination);
}
