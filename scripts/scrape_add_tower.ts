import { writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

import * as cheerio from "cheerio";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Builder, By, until, type WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

import type { CountryCode } from "@/constants/countries";
import { MATERIALS } from "@/constants/materials";
import { TowerTypeEnum } from "@/constants/towerType";
import { AdmissionType, type Admission } from "@/types/Admission";
import {
    OpeningHoursForbiddenType,
    OpeningHoursType,
    type OpeningHours,
    type OpeningHoursRange,
} from "@/types/OpeningHours";
import type { Tower, TowerContact } from "@/types/Tower";
import { DAYS_CZECH, MONTHS_CZECH_4 } from "@/utils/constants";
import { findInfoByGPS, isValidCountryCode } from "@/utils/geography";
import { createNameID, resolveUniqueNameID } from "@/utils/nameID";

const DEFAULT_WAIT_TIME_SECONDS = 10;
const DETAIL_SETTLE_TIME_MS = 2_000;
const GALLERY_SCROLL_SETTLE_TIME_MS = 500;
const GALLERY_SCROLLS = 3;
const MAX_PHOTOS = 8;
const PRODUCTION_APP_URL = "https://rozhlednovysvet.cz";
const CLOSED_HOURS_VALUES = new Set(["zavřeno", "uzavřeno"]);
const MATERIAL_ROOTS: { material: (typeof MATERIALS)[number]; roots: string[] }[] = [
    { material: "dřevo", roots: ["drev"] },
    { material: "kámen", roots: ["kamen", "zula", "piskovec"] },
    { material: "kov", roots: ["ocel", "kov", "zelez"] },
    { material: "beton", roots: ["beton"] },
    { material: "zdivo", roots: ["zdiv", "cihl"] },
    { material: "netradiční", roots: ["netradic"] },
];

type CliOptions = {
    outputPath?: string;
    url: string;
    waitTimeSeconds: number;
    write: boolean;
};

export type ScrapedKeyValue = {
    label: string;
    value: string;
};

export type ScrapedGps = {
    latitude: number;
    longitude: number;
};

export type ScrapedContact = TowerContact;

export type ScrapedGeography = {
    country?: CountryCode;
    county?: string;
    province?: string;
};

export type ParsedDetail = {
    admission: Admission;
    contact: ScrapedContact;
    description?: string;
    elevation?: number;
    gps: ScrapedGps | null;
    height?: number;
    keyValues: ScrapedKeyValue[];
    material?: string[];
    name: string | null;
    openingHours: OpeningHours;
    owner?: string;
    photos: string[];
    stairs?: number;
    type: TowerTypeEnum | null;
    urls: string[];
};

export type MapyComDetails = {
    id: string | null;
    name: string | null;
    source: string | null;
};

export type ScrapedTowerDocument = Omit<Partial<Tower>, "gps"> & {
    gps: ScrapedGps | null;
    photos: string[];
};

function log(message: string) {
    console.error(`[scrape_add_tower] ${message}`);
}

function formatError(error: unknown) {
    return error instanceof Error ? error.message : "Unknown error";
}

function normalizeText(value: string | null | undefined) {
    const normalized = value?.replace(/\s+/g, " ").trim();
    return normalized || null;
}

export function normalizeTowerName(name: string | null) {
    if (!name) return null;

    const normalizedName = name
        .replace(
            /^\s*(?:vyhlídková\s+věž|rozhledna|výhledna|pozorovatelna|věž)(?=\s|[-–—,:]|$)\s*(?:[-–—,:]\s*)?/i,
            ""
        )
        .trim();

    return normalizedName || name;
}

export { createNameID, resolveUniqueNameID };

function getScraperFirestore() {
    try {
        process.loadEnvFile(`${process.cwd()}/.env.local`);
    } catch (error) {
        if (!(error instanceof Error) || !error.message.includes("ENOENT")) {
            throw error;
        }
    }

    const appName = "scrape-add-tower";
    const app =
        getApps().find((candidate) => candidate.name === appName) ??
        initializeApp(
            {
                credential: cert({
                    clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
                    privateKey: JSON.parse(process.env.GOOGLE_PRIVATE_KEY ?? "{}").privateKey,
                    projectId: process.env.GOOGLE_PROJECTID,
                }),
            },
            appName
        );

    return getFirestore(app);
}

async function nameIDExistsInFirebase(nameID: string) {
    const snapshot = await getScraperFirestore()
        .collection("towers")
        .where("nameID", "==", nameID)
        .limit(1)
        .get();

    return !snapshot.empty;
}

export function createScrapedTowerId(result: ScrapedTowerDocument) {
    if (result.mapycz?.source && result.mapycz.id) {
        return `${result.mapycz.source}_${result.mapycz.id}`;
    }

    return result.nameID || undefined;
}

export function createScrapedTowersPurgeUrl(appUrl = PRODUCTION_APP_URL) {
    return new URL("/api/cache/purge/scraped-towers", appUrl).toString();
}

async function purgeScrapedTowersCache() {
    const appUrl = process.env.SCRAPER_APP_URL ?? PRODUCTION_APP_URL;
    const response = await fetch(createScrapedTowersPurgeUrl(appUrl), { method: "POST" });

    if (!response.ok) {
        throw new Error(`Scraped towers cache purge failed with HTTP ${response.status}.`);
    }

    log("Purged ScrapedTowers cache tag.");
}

async function persistScrapedTower(result: ScrapedTowerDocument) {
    const firestore = getScraperFirestore();
    const documentId = createScrapedTowerId(result);
    const reference = documentId
        ? firestore.collection("towers_scraped").doc(documentId)
        : firestore.collection("towers_scraped").doc();
    const existing = await reference.get();
    const status = existing.data()?.status === "imported" ? "imported" : "ready";

    await reference.set({
        ...result,
        id: reference.id,
        status,
    });

    log(`Saved scraped tower to towers_scraped/${reference.id}.`);
    await purgeScrapedTowersCache();
}

function normalizeCzechText(value: string) {
    return value
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLocaleLowerCase("cs");
}

function shouldSkipLink(href: string) {
    const normalizedHref = href.toLowerCase();
    return (
        normalizedHref.includes("nahlizenidokn") ||
        normalizedHref.includes("mapy.cz") ||
        normalizedHref.includes("mapy.com")
    );
}

function toFullSizePhotoUrl(photoUrl: string) {
    return photoUrl.replace(/([?&]fl=)[^&]*/, "$1res,2200,2200,1");
}

export function selectRandomPhotos(photoUrls: string[], random = Math.random) {
    const photos = [...new Set(photoUrls.map(toFullSizePhotoUrl))];

    for (let index = photos.length - 1; index > 0; index -= 1) {
        const selectedIndex = Math.floor(random() * (index + 1));
        [photos[index], photos[selectedIndex]] = [photos[selectedIndex], photos[index]];
    }

    return photos.slice(0, MAX_PHOTOS);
}

export function selectMainPhoto(photos: string[], random = Math.random) {
    if (photos.length === 0) return "";

    return photos[Math.floor(random() * photos.length)];
}

function parseContact($: cheerio.CheerioAPI): ScrapedContact {
    const emailLink = $(".content-contact .contact-container.email a.email").first();
    const emailHref = emailLink.attr("href");
    const websiteLink = $(".content-contact .contact-container.www a.www").first();

    return {
        email: emailHref?.startsWith("mailto:")
            ? emailHref.slice("mailto:".length)
            : (normalizeText(emailLink.text()) ?? ""),
        officialWebsite: websiteLink.attr("href") ?? "",
        phone:
            normalizeText($(".content-contact .contact-container.phone .phone").first().text()) ??
            "",
    };
}

function parseCoordinate(value: string, positiveDirection: string, negativeDirection: string) {
    const match = value.trim().match(/^(-?\d+(?:[.,]\d+)?)\s*([A-Z])$/i);

    if (!match) return null;

    const direction = match[2].toUpperCase();

    if (direction !== positiveDirection && direction !== negativeDirection) return null;

    const coordinate = Number.parseFloat(match[1].replace(",", "."));
    if (!Number.isFinite(coordinate)) return null;

    return direction === negativeDirection ? -Math.abs(coordinate) : Math.abs(coordinate);
}

export function parseGpsCoordinates(value: string | null | undefined): ScrapedGps | null {
    if (!value) return null;

    const [latitudeValue, longitudeValue, ...remainingValues] = value.split(",");
    if (remainingValues.length > 0 || !latitudeValue || !longitudeValue) return null;

    const latitude = parseCoordinate(latitudeValue, "N", "S");
    const longitude = parseCoordinate(longitudeValue, "E", "W");

    if (
        latitude === null ||
        longitude === null ||
        Math.abs(latitude) > 90 ||
        Math.abs(longitude) > 180
    ) {
        return null;
    }

    return { latitude, longitude };
}

type ReverseGeocoder = typeof findInfoByGPS;

export async function resolveGeography(
    gps: ScrapedGps | null,
    reverseGeocode: ReverseGeocoder = findInfoByGPS
): Promise<ScrapedGeography> {
    if (!gps) return {};

    const result = await reverseGeocode({ lat: gps.latitude, lng: gps.longitude });
    if (!result || !isValidCountryCode(result.countryCode)) return {};

    return {
        country: result.countryCode,
        ...(result.county ? { county: result.county } : {}),
        ...(result.provinceCode ? { province: result.provinceCode } : {}),
    };
}

function parseMonth(value: string) {
    return MONTHS_CZECH_4.map((month) => month.toLocaleLowerCase("cs")).indexOf(
        value.toLocaleLowerCase("cs")
    );
}

function parseSeasonMonths(value: string) {
    const matches = [
        ...value.matchAll(
            /\d{1,2}\.\s*([a-záčďéěíňóřšťúůýž]+)\s*[–-]\s*\d{1,2}\.\s*([a-záčďéěíňóřšťúůýž]+)/gi
        ),
    ];
    const match = matches[0];

    if (!match || matches.length !== 1) return null;

    const monthFrom = parseMonth(match[1]);
    const monthTo = parseMonth(match[2]);

    if (monthFrom < 0 || monthTo < 0 || monthFrom > monthTo) return null;

    return { monthFrom, monthTo };
}

function parseTime(value: string) {
    const match = value.trim().match(/^(\d{1,2})(?::(\d{2}))?$/);
    if (!match) return null;

    const hours = Number.parseInt(match[1], 10);
    const minutes = match[2] ? Number.parseInt(match[2], 10) : 0;

    if (hours > 23 || minutes > 59) return null;

    return hours + minutes / 60;
}

function parseHours(value: string) {
    if (CLOSED_HOURS_VALUES.has(value.trim().toLocaleLowerCase("cs"))) return null;

    const match = value.trim().match(/^(.+?)\s*[–-]\s*(.+)$/);
    if (!match) return null;

    const dayFrom = parseTime(match[1]);
    const dayTo = parseTime(match[2]);

    if (dayFrom === null || dayTo === null || dayTo <= dayFrom) return null;

    return { dayFrom, dayTo };
}

function parseSeasonRanges(
    $: cheerio.CheerioAPI,
    seasonHtml: string,
    months: Pick<OpeningHoursRange, "monthFrom" | "monthTo">
) {
    const seasonElement = $(seasonHtml);
    const dayCells = seasonElement.find(".column").first().find(".cell");
    const hourCells = seasonElement.find(".column.hours").first().find(".cell");

    if (dayCells.length === 1 && hourCells.length === 1 && !parseHours(hourCells.first().text())) {
        return [];
    }
    if (dayCells.length !== 7 || hourCells.length !== 7) return [];

    const openDays = new Map<string, { days: number[]; dayFrom: number; dayTo: number }>();

    for (let index = 0; index < 7; index += 1) {
        if (normalizeText(dayCells.eq(index).text()) !== DAYS_CZECH[index]) return [];

        const hours = parseHours(hourCells.eq(index).text());
        if (!hours) continue;

        const key = `${hours.dayFrom}-${hours.dayTo}`;
        const existing = openDays.get(key) ?? { ...hours, days: [] };
        existing.days.push(index);
        openDays.set(key, existing);
    }

    return [...openDays.values()].map((schedule) => ({ ...months, ...schedule }));
}

function isYearRoundNonStopSeason(
    $: cheerio.CheerioAPI,
    seasonHtml: string,
    months: Pick<OpeningHoursRange, "monthFrom" | "monthTo">
) {
    if (months.monthFrom !== 0 || months.monthTo !== 11) return false;

    const seasonElement = $(seasonHtml);
    const dayCells = seasonElement.find(".column").first().find(".cell");
    const hourCells = seasonElement.find(".column.hours").first().find(".cell");

    return (
        dayCells.length === 7 &&
        hourCells.length === 7 &&
        dayCells
            .toArray()
            .every((cell, index) => normalizeText($(cell).text()) === DAYS_CZECH[index]) &&
        hourCells.toArray().every((cell) => normalizeCzechText($(cell).text()) === "nonstop")
    );
}

function parseOpeningHours($: cheerio.CheerioAPI): OpeningHours {
    const isInaccessible = $(".content-admission")
        .toArray()
        .some((admission) => normalizeCzechText($(admission).text()).includes("nepristupny"));
    if (isInaccessible) {
        return {
            forbiddenType: OpeningHoursForbiddenType.Banned,
            type: OpeningHoursType.Forbidden,
        };
    }

    const openingDetail = $("div.content-opening").first();
    if (openingDetail.length === 0) return { type: OpeningHoursType.Unknown };

    const detailText = normalizeText(
        openingDetail
            .find(".opening-notes .note")
            .map((_, note) => $(note).text())
            .get()
            .join("\n")
    );
    const ranges: OpeningHoursRange[] = [];
    let hasYearRoundNonStopSeason = false;

    openingDetail.find(".season-cont").each((_, season) => {
        const seasonElement = $(season);
        const seasons = seasonElement.children(".season");
        const dropdownMonths = seasonElement
            .find(".ui-dropdown-option")
            .map((_, option) => parseSeasonMonths($(option).text()))
            .get();

        if (dropdownMonths.length === seasons.length && seasons.length > 0) {
            seasons.each((index, seasonContent) => {
                const months = dropdownMonths[index];
                if (months) {
                    const seasonHtml = $(seasonContent).html() ?? "";
                    if (isYearRoundNonStopSeason($, seasonHtml, months)) {
                        hasYearRoundNonStopSeason = true;
                        return;
                    }
                    ranges.push(...parseSeasonRanges($, seasonHtml, months));
                }
            });
            return;
        }

        const months = parseSeasonMonths(seasonElement.children(".season-title").first().text());
        const seasonContent = seasons.first();
        if (months && seasonContent.length > 0) {
            const seasonHtml = seasonContent.html() ?? "";
            if (isYearRoundNonStopSeason($, seasonHtml, months)) {
                hasYearRoundNonStopSeason = true;
            } else {
                ranges.push(...parseSeasonRanges($, seasonHtml, months));
            }
        }
    });

    if (hasYearRoundNonStopSeason) return { type: OpeningHoursType.NonStop };

    if (ranges.length === 0) {
        const type =
            detailText?.toLocaleLowerCase("cs").includes("po dohodě") ||
            detailText?.toLocaleLowerCase("cs").includes("příležitostně")
                ? OpeningHoursType.Occasionally
                : OpeningHoursType.Unknown;

        return detailText ? { detailText, type } : { type };
    }

    const type =
        ranges.length === 1 && ranges[0].monthFrom === 0 && ranges[0].monthTo === 11
            ? OpeningHoursType.EveryMonth
            : OpeningHoursType.SomeMonths;

    return {
        ranges,
        type,
    };
}

function parseTowerNumber(value: string, requiredUnit?: string) {
    const match = value.trim().match(/^(\d+(?:[.,]\d+)?)\s*([^\d\s]+)?(?:\s+.*)?$/i);
    if (!match) return null;

    const unit = match[2]?.toLocaleLowerCase("cs");
    if (requiredUnit && unit !== requiredUnit) return null;

    const parsed = Number.parseFloat(match[1].replace(",", "."));
    return Number.isFinite(parsed) ? parsed : null;
}

function parseMaterials(value: string) {
    const parts = value
        .split(/[,;/]+/)
        .map((part) => part.trim())
        .filter(Boolean);
    const materials: string[] = [];
    let hasUnknownPart = parts.length === 0;

    for (const part of parts) {
        const normalizedPart = normalizeCzechText(part);
        const material = MATERIAL_ROOTS.find(({ roots }) =>
            roots.some((root) => normalizedPart.includes(root))
        )?.material;

        if (!material) {
            hasUnknownPart = true;
            continue;
        }

        if (!materials.includes(material)) materials.push(material);
    }

    return { hasUnknownPart, materials };
}

function mapTowerKeyValues($: cheerio.CheerioAPI) {
    const keyValues: ScrapedKeyValue[] = [];
    const mapped: Pick<ParsedDetail, "elevation" | "height" | "material" | "owner" | "stairs"> = {};

    $("div.content-keyval tr").each((_, row) => {
        const cells = $(row).find("td");
        const label = normalizeText(cells.first().text())?.replace(/:\s*$/, "");
        const value = normalizeText(cells.eq(1).text());

        if (!label || !value) return;

        const normalizedLabel = label.toLocaleLowerCase("cs");
        if (normalizedLabel === "provozovatel") {
            mapped.owner = value;
            return;
        }
        if (normalizedLabel === "materiál") {
            const parsedMaterials = parseMaterials(value);
            if (parsedMaterials.materials.length > 0) mapped.material = parsedMaterials.materials;
            if (!parsedMaterials.hasUnknownPart && parsedMaterials.materials.length > 0) return;
            keyValues.push({ label, value });
            return;
        }
        const parsedValue =
            normalizedLabel === "výška" || normalizedLabel === "nadmořská výška"
                ? parseTowerNumber(value, "m")
                : normalizedLabel === "počet schodů"
                  ? parseTowerNumber(value)
                  : null;

        if (parsedValue === null) {
            keyValues.push({ label, value });
            return;
        }

        if (normalizedLabel === "výška") mapped.height = parsedValue;
        if (normalizedLabel === "nadmořská výška") mapped.elevation = parsedValue;
        if (normalizedLabel === "počet schodů") mapped.stairs = parsedValue;
    });

    return { keyValues, mapped };
}

function parseAdmission($: cheerio.CheerioAPI, openingHours: OpeningHours): Admission {
    const admissionTexts = $(".content-admission")
        .map((_, admission) => normalizeCzechText($(admission).text()))
        .get();
    const type = admissionTexts.some((text) => text.includes("zpoplatnen"))
        ? AdmissionType.PAID
        : admissionTexts.some((text) => text.includes("volny")) ||
            openingHours.type === OpeningHoursType.NonStop
          ? AdmissionType.FREE
          : admissionTexts.some((text) => text.includes("dobrovoln"))
            ? AdmissionType.DONATION
            : AdmissionType.UNKNOWN;

    return { tariffes: {}, type };
}

function normalizeTowerType(
    mapyComType: string | null,
    name: string | null,
    description: string | null
): TowerTypeEnum | null {
    const normalizedMapyComType = mapyComType ? normalizeCzechText(mapyComType) : null;

    if (normalizedMapyComType === "rozhledna") return TowerTypeEnum.ROZHLEDNA;
    if (normalizedMapyComType === "pozorovatelna zvere") return TowerTypeEnum.POZOROVATELNA;
    if (normalizedMapyComType !== "vez budovy s vyhlidkou") return null;

    const context = normalizeCzechText([name, description].filter(Boolean).join(" "));

    if (context.includes("vodar") || context.includes("vodojem")) {
        return TowerTypeEnum.VODARENSKA_VEZ;
    }
    if (context.includes("hrad")) return TowerTypeEnum.HRADNI_VEZ;
    if (context.includes("zame") || context.includes("zamk")) return TowerTypeEnum.ZAMECKA_VEZ;
    if (context.includes("kostel")) return TowerTypeEnum.KOSTELNI_VEZ;
    if (context.includes("radnic")) return TowerTypeEnum.MESTSKA_VEZ;

    return TowerTypeEnum.MESTSKA_VEZ;
}

export function parseDetailHtml(detailHtml: string): ParsedDetail {
    const $ = cheerio.load(detailHtml);
    const { keyValues, mapped } = mapTowerKeyValues($);
    const contact = parseContact($);
    const urls: string[] = contact.officialWebsite ? [contact.officialWebsite] : [];
    const name = normalizeTowerName(normalizeText($("h1").first().text()));
    const description = normalizeText($("div.content-description").first().text());
    const mapyComType = normalizeText($("div.content-typename").first().text());
    const openingHours = parseOpeningHours($);

    $("div.content-link a").each((_, link) => {
        const href = $(link).attr("href");

        if (!href || shouldSkipLink(href)) {
            return;
        }

        urls.push(href);
    });

    return {
        ...mapped,
        ...(description ? { description } : {}),
        admission: parseAdmission($, openingHours),
        contact,
        gps: parseGpsCoordinates($("div.gps input").first().attr("value")),
        keyValues,
        name,
        openingHours,
        photos: [],
        type: normalizeTowerType(mapyComType, name, description),
        urls: [...new Set(urls)],
    };
}

export function extractMapyCzDetails(
    currentUrl: string,
    name: string | null = null
): MapyComDetails {
    try {
        const url = new URL(currentUrl);

        return {
            id: url.searchParams.get("id"),
            name,
            source: url.searchParams.get("source"),
        };
    } catch {
        return {
            id: null,
            name,
            source: null,
        };
    }
}

export function createMapyComUrl(mapycom: Pick<MapyComDetails, "id" | "source">) {
    if (!mapycom.source || !mapycom.id) return null;

    const searchParams = new URLSearchParams();
    searchParams.set("source", mapycom.source);
    searchParams.set("id", mapycom.id);

    return `https://mapy.com/cs/turisticka?${searchParams.toString()}`;
}

export function createScrapedTowerDocument(
    parsedDetail: ParsedDetail,
    geography: ScrapedGeography,
    mapycom: MapyComDetails,
    nameID: string | null,
    urls: string[],
    photos: string[],
    createdAt = new Date().toISOString()
): ScrapedTowerDocument {
    const mapycz =
        mapycom.id && mapycom.source
            ? {
                  href: createMapyComUrl(mapycom) ?? "",
                  id: mapycom.id,
                  lastMapped: createdAt,
                  name: mapycom.name ?? parsedDetail.name ?? "",
                  source: mapycom.source,
                  type: parsedDetail.type ?? "",
              }
            : undefined;

    return {
        admission: parsedDetail.admission,
        contact: parsedDetail.contact,
        ...(parsedDetail.description ? { description: parsedDetail.description } : {}),
        elevation: parsedDetail.elevation ?? 0,
        gps: parsedDetail.gps,
        height: parsedDetail.height ?? 0,
        mainPhotoUrl: selectMainPhoto(photos),
        ...(mapycz ? { mapycz } : {}),
        material: parsedDetail.material ?? [],
        name: parsedDetail.name ?? "",
        nameID: nameID ?? "",
        openingHours: parsedDetail.openingHours,
        ...(parsedDetail.owner ? { owner: parsedDetail.owner } : {}),
        photos,
        stairs: parsedDetail.stairs ?? 0,
        ...(parsedDetail.type ? { type: parsedDetail.type } : {}),
        urls,
        ...geography,
        created: createdAt,
        modified: createdAt,
    };
}

function parsePositiveNumber(value: string, optionName: string) {
    const parsed = Number(value);

    if (!Number.isFinite(parsed) || parsed <= 0) {
        throw new Error(`${optionName} must be a positive number.`);
    }

    return parsed;
}

export function parseCliOptions(args = process.argv.slice(2)): CliOptions {
    let outputPath: string | undefined;
    let url: string | undefined;
    let waitTimeSeconds = DEFAULT_WAIT_TIME_SECONDS;
    let positionalOnly = false;
    let write = false;

    for (let index = 0; index < args.length; index += 1) {
        const arg = args[index];
        const nextArg = args[index + 1];

        if (arg === "--") {
            positionalOnly = true;
            continue;
        }

        if (!positionalOnly && arg === "--write") {
            write = true;
            continue;
        }

        if (!positionalOnly && (arg === "--url" || arg === "-u") && nextArg) {
            url = nextArg;
            index += 1;
            continue;
        }

        if (!positionalOnly && (arg === "--output" || arg === "-o") && nextArg) {
            outputPath = nextArg;
            index += 1;
            continue;
        }

        if (!positionalOnly && (arg === "--wait" || arg === "-w") && nextArg) {
            waitTimeSeconds = parsePositiveNumber(nextArg, "--wait");
            index += 1;
            continue;
        }

        if (!arg.startsWith("-") && !url) {
            url = arg;
            continue;
        }

        throw new Error(`Unknown or incomplete argument: ${arg}`);
    }

    if (!url) {
        throw new Error(
            "Missing Mapy.cz URL. Usage: pnpm scrape:add-tower <url> [--output path] [--wait seconds] [--write]"
        );
    }

    try {
        new URL(url);
    } catch {
        throw new Error("The provided URL is invalid.");
    }

    return { outputPath, url, waitTimeSeconds, write };
}

function createChromeDriver() {
    const options = new chrome.Options();

    options.addArguments("--disable-gpu", "--no-sandbox", "--lang=cs");
    options.setUserPreferences({ intl: { accept_languages: "cs,cs-CZ" } });

    return new Builder().forBrowser("chrome").setChromeOptions(options).build();
}

async function waitForDetailPage(driver: WebDriver, waitTimeSeconds: number) {
    const waitTimeMs = waitTimeSeconds * 1_000;

    log(`Waiting up to ${waitTimeSeconds}s for the detail content.`);
    const detail = await driver.wait(until.elementLocated(By.id("detail")), waitTimeMs);

    await driver.wait(until.elementIsVisible(detail), waitTimeMs);
    await driver.wait(until.elementLocated(By.className("content-typename")), waitTimeMs);
    await driver.wait(until.elementLocated(By.css("h1")), waitTimeMs);
    await driver.wait(until.elementLocated(By.className("content-link")), waitTimeMs);

    log(
        `Detail content loaded; waiting ${DETAIL_SETTLE_TIME_MS / 1_000}s for rendering to settle.`
    );
    await driver.sleep(DETAIL_SETTLE_TIME_MS);

    return detail;
}

async function scrapeGalleryPhotos(driver: WebDriver, waitTimeSeconds: number) {
    const waitTimeMs = waitTimeSeconds * 1_000;
    const poster = await driver.findElements(By.css("div.content-poster a"));

    if (poster.length === 0) {
        log("Found no photo gallery poster.");
        return [];
    }

    log("Opening photo gallery.");
    await poster[0].click();
    await driver.wait(until.elementLocated(By.css("figure.pig-figure")), waitTimeMs);

    const photoUrls = new Set<string>();

    for (let scroll = 0; scroll < GALLERY_SCROLLS; scroll += 1) {
        const galleryState = (await driver.executeScript(`
            const gallery = Array.from(document.querySelectorAll('.content')).find(
                (element) => element.querySelector('figure.pig-figure')
            );
            if (!gallery) return [];

            const photoUrls = Array.from(gallery.querySelectorAll('figure.pig-figure img:not(.pig-thumbnail)'))
                .map((image) => image.getAttribute('src'))
                .filter((src) => src && src.includes('sdn.cz'));
            gallery.scrollTop += Math.max(500, gallery.clientHeight * 0.75);

            return photoUrls;
        `)) as string[];

        galleryState.forEach((photoUrl) => photoUrls.add(photoUrl));

        await driver.sleep(GALLERY_SCROLL_SETTLE_TIME_MS);
    }

    const photos = selectRandomPhotos([...photoUrls]);
    log(`Found ${photoUrls.size} gallery photos; selected ${photos.length}.`);

    return photos;
}

export async function scrapeDetailPage(
    url: string,
    waitTimeSeconds = DEFAULT_WAIT_TIME_SECONDS
): Promise<ScrapedTowerDocument> {
    log(`Opening URL: ${url}`);
    const driver = await createChromeDriver();

    try {
        await driver.get(url);
        const detail = await waitForDetailPage(driver, waitTimeSeconds);
        const [detailHtml, currentUrl] = await Promise.all([
            detail.getAttribute("outerHTML"),
            driver.getCurrentUrl(),
        ]);

        if (!detailHtml) {
            throw new Error("The Mapy.cz detail container did not contain HTML.");
        }

        log(`Resolved URL: ${currentUrl}`);
        const parsedDetail = parseDetailHtml(detailHtml);
        const mapycom = extractMapyCzDetails(
            currentUrl,
            normalizeText(cheerio.load(detailHtml)("h1").first().text())
        );

        log(`Found name: ${parsedDetail.name ?? "not found"}`);
        log(`Found type: ${parsedDetail.type ?? "not found"}`);
        log(`Found description: ${parsedDetail.description ?? "not found"}`);
        log(`Found Mapy.com ID: ${mapycom.id ?? "not found"}`);
        log(`Found Mapy.com source: ${mapycom.source ?? "not found"}`);
        const mapycomUrl = createMapyComUrl(mapycom);
        const urls = mapycomUrl
            ? [...new Set([...parsedDetail.urls, mapycomUrl])]
            : parsedDetail.urls;
        let geography: ScrapedGeography = {};

        if (parsedDetail.gps) {
            try {
                log("Resolving country, province, and county with Nominatim.");
                geography = await resolveGeography(parsedDetail.gps);
                log(
                    geography.country
                        ? `Resolved geography: ${geography.country}, ${geography.province ?? "unknown province"}, ${geography.county ?? "unknown county"}.`
                        : "Nominatim did not resolve supported project geography."
                );
            } catch (error) {
                log(`Nominatim lookup failed: ${formatError(error)}.`);
            }
        }
        let nameID: string | null = null;

        if (parsedDetail.name) {
            log("Checking nameID uniqueness in Firebase.");
            nameID = await resolveUniqueNameID(
                parsedDetail.name,
                geography.county,
                nameIDExistsInFirebase
            );
            log(`Resolved nameID: ${nameID}.`);
        }
        log(`Mapped height: ${parsedDetail.height ?? "not found"}`);
        log(`Mapped elevation: ${parsedDetail.elevation ?? "not found"}`);
        log(`Mapped stairs: ${parsedDetail.stairs ?? "not found"}`);
        log(
            parsedDetail.gps
                ? `Found GPS: ${parsedDetail.gps.latitude}, ${parsedDetail.gps.longitude}`
                : "Found no GPS coordinates."
        );
        log(`Mapped opening-hours type: ${OpeningHoursType[parsedDetail.openingHours.type]}.`);

        for (const keyValue of parsedDetail.keyValues) {
            log(`Warning: found unused key-value: ${keyValue.label} - ${keyValue.value}`);
        }

        if (urls.length === 0) {
            log("Found no external URLs.");
        } else {
            for (const url of urls) {
                log(`Found external URL: ${url}`);
            }
        }

        let photos: string[] = [];

        try {
            photos = await scrapeGalleryPhotos(driver, waitTimeSeconds);
        } catch (error) {
            log(`Photo gallery scraping failed: ${formatError(error)}.`);
        }
        return createScrapedTowerDocument(parsedDetail, geography, mapycom, nameID, urls, photos);
    } finally {
        log("Closing Chrome driver.");
        await driver.quit();
    }
}

async function writeResult(result: ScrapedTowerDocument, outputPath?: string) {
    const json = `${JSON.stringify(result, null, 2)}\n`;

    if (outputPath) {
        await writeFile(outputPath, json, "utf8");
        log(`Wrote JSON document to ${outputPath}.`);
        return;
    }

    process.stdout.write(json);
    log("Wrote JSON document to standard output.");
}

async function main() {
    const options = parseCliOptions();
    const result = await scrapeDetailPage(options.url, options.waitTimeSeconds);

    if (options.write) {
        await persistScrapedTower(result);
    } else {
        log("Skipping Firestore persistence; use --write to save the scraped tower.");
    }
    await writeResult(result, options.outputPath);
}

const isExecutedDirectly =
    process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isExecutedDirectly) {
    void main().catch((error: unknown) => {
        console.error(`[scrape_add_tower] Failed: ${formatError(error)}`);
        process.exitCode = 1;
    });
}
