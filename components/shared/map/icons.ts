import {
    Binoculars,
    Building2,
    Castle,
    Check,
    Church,
    Eye,
    Heart,
    Landmark,
    Shield,
    Star,
    TowerControl,
    type LucideIcon,
    Waves,
} from "lucide-react";
import { createElement } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

import { TowerTypeEnum } from "@/constants/towerType";
import type { MapTowerPersonalStatuses } from "@/utils/mapTowerFilters";

type TowerMarkerStyle = {
    background: string;
    color: string;
    Icon: LucideIcon;
};

const TOWER_TYPE_MARKER_STYLES: Record<TowerTypeEnum, TowerMarkerStyle> = {
    [TowerTypeEnum.ROZHLEDNA]: {
        background: "#d1fae5",
        color: "#047857",
        Icon: TowerControl,
    },
    [TowerTypeEnum.VYHLEDNA]: { background: "#e0f2fe", color: "#0369a1", Icon: Eye },
    [TowerTypeEnum.POZOROVATELNA]: { background: "#cffafe", color: "#0e7490", Icon: Binoculars },
    [TowerTypeEnum.MESTSKA_VEZ]: { background: "#fef3c7", color: "#b45309", Icon: Building2 },
    [TowerTypeEnum.HRADNI_VEZ]: { background: "#ffe4e6", color: "#be123c", Icon: Castle },
    [TowerTypeEnum.ZAMECKA_VEZ]: { background: "#fae8ff", color: "#a21caf", Icon: Landmark },
    [TowerTypeEnum.KOSTELNI_VEZ]: { background: "#ede9fe", color: "#6d28d9", Icon: Church },
    [TowerTypeEnum.VODARENSKA_VEZ]: { background: "#dbeafe", color: "#1d4ed8", Icon: Waves },
    [TowerTypeEnum.VOJENSKA_VEZ]: { background: "#e7e5e4", color: "#57534e", Icon: Shield },
};

const GONE_MARKER_STYLE: TowerMarkerStyle = {
    background: "#e5e7eb",
    color: "#6b7280",
    Icon: TowerControl,
};

const renderIconSvg = (Icon: LucideIcon) => {
    const container = document.createElement("span");
    const root = createRoot(container);

    flushSync(() => {
        root.render(createElement(Icon, { "aria-hidden": true, size: 16, strokeWidth: 2.3 }));
    });

    const svg = container.innerHTML;
    root.unmount();

    return svg;
};

const renderStatusBadge = (
    Icon: LucideIcon,
    label: string,
    position: string,
    background: string,
    color: string
) => {
    return `<span aria-label="${label}" style="align-items:center;background:${background};border:1px solid #ffffff;${position};border-radius:9999px;box-shadow:0 1px 2px rgb(0 0 0 / 0.25);color:${color};display:flex;height:13px;justify-content:center;position:absolute;width:13px">${renderIconSvg(Icon)}</span>`;
};

export const getTowerMapIcon = (
    L: typeof import("leaflet"),
    type: TowerTypeEnum,
    isGone: boolean,
    personalStatuses?: MapTowerPersonalStatuses
) => {
    const markerStyle = isGone
        ? GONE_MARKER_STYLE
        : (TOWER_TYPE_MARKER_STYLES[type] ?? TOWER_TYPE_MARKER_STYLES[TowerTypeEnum.ROZHLEDNA]);

    if (!personalStatuses) {
        return L.divIcon({
            className: "tower-map-type-icon",
            html: `<span style="align-items:center;background:${markerStyle.background};border:1px solid ${markerStyle.color};border-radius:4px;box-shadow:0 1px 3px rgb(0 0 0 / 0.25);color:${markerStyle.color};display:flex;height:24px;justify-content:center;width:24px">${renderIconSvg(markerStyle.Icon)}</span>`,
            iconAnchor: [12, 12],
            iconSize: [24, 24],
            popupAnchor: [0, -12],
        });
    }

    const badges = [
        personalStatuses.isVisited
            ? renderStatusBadge(Check, "Navštíveno", "right:0;top:0", "#dcfce7", "#15803d")
            : "",
        personalStatuses.isFavourite
            ? renderStatusBadge(Heart, "V oblíbených", "bottom:0;right:0", "#fef3c7", "#b45309")
            : "",
        personalStatuses.isRated
            ? renderStatusBadge(Star, "Hodnoceno", "bottom:0;left:0", "#f3e8ff", "#7e22ce")
            : "",
    ].join("");

    return L.divIcon({
        className: "tower-map-type-icon",
        html: `<span style="display:block;height:38px;position:relative;width:38px"><span style="align-items:center;background:${markerStyle.background};border:1px solid ${markerStyle.color};border-radius:4px;box-shadow:0 1px 3px rgb(0 0 0 / 0.25);color:${markerStyle.color};display:flex;height:24px;justify-content:center;left:7px;position:absolute;top:7px;width:24px">${renderIconSvg(markerStyle.Icon)}</span>${badges}</span>`,
        iconAnchor: [19, 19],
        iconSize: [38, 38],
        popupAnchor: [0, -19],
    });
};
