"use client";

import { track } from "@vercel/analytics";
import { useEffect } from "react";

type PageViewTrackerProps = {
    eventName: "Community page viewed" | "Tower viewed";
    towerType?: string;
};

function getSource() {
    const referrer = new URL(document.referrer || window.location.origin);

    if (referrer.origin !== window.location.origin) {
        return "external";
    }

    if (referrer.pathname === "/") {
        return "homepage";
    }

    if (referrer.pathname.startsWith("/mapa")) {
        return "map";
    }

    if (referrer.pathname.startsWith("/rozhledny")) {
        return "list";
    }

    return "other";
}

export default function PageViewTracker({ eventName, towerType }: PageViewTrackerProps) {
    useEffect(() => {
        track(eventName, {
            source: getSource(),
            ...(towerType ? { towerType } : {}),
        });
    }, [eventName, towerType]);

    return null;
}
