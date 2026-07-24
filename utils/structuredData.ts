import { OpeningHours, OpeningHoursRange, OpeningHoursType } from "@/types/OpeningHours";
import { Tower } from "@/types/Tower";
import { SITE_URL } from "@/utils/constants";
import { getOpeningHoursRanges, normalizeOpeningHours } from "@/utils/openingHours";

export const serializeJsonLd = (data: unknown): string =>
    JSON.stringify(data)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026")
        .replace(/\u2028/g, "\\u2028")
        .replace(/\u2029/g, "\\u2029");

const SCHEMA_WEEKDAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

type OpeningHoursSpecification = {
    "@type": "OpeningHoursSpecification";
    dayOfWeek: string[];
    opens: string;
    closes: string;
};

type BreadcrumbList = {
    "@type": "BreadcrumbList";
    itemListElement: {
        "@type": "ListItem";
        position: number;
        name: string;
        item: string;
    }[];
};

type TouristAttraction = {
    "@id": string;
    "@type": "TouristAttraction";
    address: {
        "@type": "PostalAddress";
        addressLocality: string;
        addressRegion: string;
    };
    description: string;
    geo: {
        "@type": "GeoCoordinates";
        latitude: number;
        longitude: number;
    };
    image: string[];
    name: string;
    sameAs: string[];
    touristType: string[];
    url: string;
    openingHoursSpecification?: OpeningHoursSpecification[];
};

type TowerJsonLd = {
    "@context": "https://schema.org";
    "@graph": [TouristAttraction, BreadcrumbList];
};

const formatSchemaTime = (hour: number): string => {
    const totalMinutes = Math.round(hour * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

const isValidOpeningTime = (hour: number): boolean =>
    Number.isFinite(hour) && hour >= 0 && hour < 24;

const isUsableYearRoundRange = (range: OpeningHoursRange): boolean =>
    range.monthFrom === 0 &&
    range.monthTo === 11 &&
    range.days.length > 0 &&
    range.days.every((day) => Number.isInteger(day) && day >= 0 && day <= 6) &&
    isValidOpeningTime(range.dayFrom) &&
    isValidOpeningTime(range.dayTo) &&
    range.dayTo > range.dayFrom &&
    (!range.lunchBreak ||
        (isValidOpeningTime(range.lunchFrom ?? Number.NaN) &&
            isValidOpeningTime(range.lunchTo ?? Number.NaN) &&
            range.lunchFrom! > range.dayFrom &&
            range.lunchTo! < range.dayTo &&
            range.lunchTo! > range.lunchFrom!));

const getRangeOpeningHoursSpecifications = (
    range: OpeningHoursRange
): OpeningHoursSpecification[] => {
    const dayOfWeek = [...new Set(range.days)]
        .sort((dayA, dayB) => dayA - dayB)
        .map((day) => SCHEMA_WEEKDAYS[day]);
    const openingHours = {
        "@type": "OpeningHoursSpecification" as const,
        dayOfWeek,
    };

    if (!range.lunchBreak) {
        return [
            {
                ...openingHours,
                opens: formatSchemaTime(range.dayFrom),
                closes: formatSchemaTime(range.dayTo),
            },
        ];
    }

    return [
        {
            ...openingHours,
            opens: formatSchemaTime(range.dayFrom),
            closes: formatSchemaTime(range.lunchFrom!),
        },
        {
            ...openingHours,
            opens: formatSchemaTime(range.lunchTo!),
            closes: formatSchemaTime(range.dayTo),
        },
    ];
};

const getOpeningHoursSpecification = (openingHours: OpeningHours): OpeningHoursSpecification[] => {
    const normalizedOpeningHours = normalizeOpeningHours(openingHours);

    if (
        normalizedOpeningHours.type === OpeningHoursType.NonStop &&
        !normalizedOpeningHours.isLockedAtNight
    ) {
        return [
            {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: SCHEMA_WEEKDAYS,
                opens: "00:00",
                closes: "23:59",
            },
        ];
    }

    if (normalizedOpeningHours.type !== OpeningHoursType.EveryMonth) return [];

    const ranges = getOpeningHoursRanges(normalizedOpeningHours);
    if (!ranges.length || !ranges.every(isUsableYearRoundRange)) return [];

    return ranges.flatMap(getRangeOpeningHoursSpecifications);
};

export const getTowerJsonLd = ({
    tower,
    url,
    description,
    images,
    countyLabel,
    provinceLabel,
}: {
    tower: Tower;
    url: string;
    description: string;
    images: string[];
    countyLabel?: string;
    provinceLabel?: string;
}): TowerJsonLd => {
    const openingHoursSpecification = getOpeningHoursSpecification(tower.openingHours);
    const attraction: TouristAttraction = {
        "@id": `${url}#schema`,
        "@type": "TouristAttraction",
        url,
        name: tower.name,
        description,
        image: images,
        address: {
            "@type": "PostalAddress",
            addressLocality: countyLabel ?? "",
            addressRegion: provinceLabel ?? "",
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: tower.gps.latitude,
            longitude: tower.gps.longitude,
        },
        touristType: ["Sightseeing", "Hiking", "Photography"],
        sameAs: [
            tower.mapycz?.href,
            tower.gmaps?.url,
            tower.urls?.find((item) => item.includes("wikipedia")),
        ].filter((item): item is string => Boolean(item)),
        ...(openingHoursSpecification.length ? { openingHoursSpecification } : {}),
    };

    return {
        "@context": "https://schema.org",
        "@graph": [
            attraction,
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: "Domů",
                        item: `${SITE_URL}/`,
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: "Rozhledny a vyhlídky",
                        item: `${SITE_URL}/rozhledny`,
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: tower.name,
                        item: url,
                    },
                ],
            },
        ],
    };
};

export const getCollectionPageJsonLd = ({
    url,
    name,
    description,
}: {
    url: string;
    name: string;
    description: string;
}) => ({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: "cs-CZ",
    isPartOf: {
        "@id": `${SITE_URL}/#website`,
    },
});

export const getMapJsonLd = ({
    url,
    name,
    description,
    towerCount,
}: {
    url: string;
    name: string;
    description: string;
    towerCount: number;
}) => ({
    "@context": "https://schema.org",
    "@type": "Map",
    "@id": `${url}#map`,
    url,
    name,
    description,
    inLanguage: "cs-CZ",
    isPartOf: {
        "@id": `${SITE_URL}/#website`,
    },
    mainEntity: {
        "@type": "ItemList",
        name: "Rozhledny a vyhlídky na mapě",
        numberOfItems: towerCount,
    },
});
