import { Footprints, ListOrdered, Mountain, Ruler, Star, Unlock } from "lucide-react";
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import TowerAliases from "@/components/shared/TowerAliases";
import SuggestCorrectionCta from "@/components/tower/edit/SuggestCorrectionCta";
import SuggestEditModal from "@/components/tower/edit/SuggestEditModal";
import PracticalInfo from "@/components/tower/PracticalInfo";
import RatingFormProvider from "@/components/tower/rating/RatingProvider";
import ChangesHistory from "@/components/tower/tiles/ChangesHistory";
import HistoryText from "@/components/tower/tiles/HistoryText";
import MapTile from "@/components/tower/tiles/MapTile";
import Sources from "@/components/tower/tiles/Sources";
import Buttons from "@/components/tower/top/Buttons";
import Carousel from "@/components/tower/top/Carousel";
import Legend from "@/components/tower/top/Legend";
import LocationBreadcrumbs from "@/components/tower/top/LocationBreadcrumbs";
import NearbyTowers from "@/components/tower/top/NearbyTowers";
import { TOWER_TAG_DETAILS } from "@/constants/towerTags";
import { MapProvider } from "@/context/MapContext";
import { listTowerPhotos } from "@/data/photo/tower-photos";
import { getNearestTowers } from "@/data/tower/nearest-towers";
import { getUrlsTowerGallery } from "@/data/tower/tower-gallery";
import {
    getTowerObjectByNameID,
    getTowerRatingAndCount,
    getTowerVisitsCount,
} from "@/data/tower/towers";
import { OpeningHoursForbiddenType, OpeningHoursType } from "@/types/OpeningHours";
import { Tower } from "@/types/Tower";
import { SITE_URL } from "@/utils/constants";
import { formatCountyName, formatProvinceName } from "@/utils/geography";
import { normalizeOpeningHours } from "@/utils/openingHours";
import { getTowerJsonLd, serializeJsonLd } from "@/utils/structuredData";
import { getTowerHeroDescription, getTowerSeoDescription } from "@/utils/towerDescriptions";
import { getCanonicalTowerPath, isCanonicalTowerType } from "@/utils/towerRoute";

const HERO_TAG_CLASS =
    "inline-flex items-center gap-1.5 rounded-md border border-base-300/70 bg-base-100/75 px-2.5 py-1 shadow-sm whitespace-nowrap";

const getTowerHeroTags = (tower: Tower) =>
    (tower.tags ?? [])
        .map((tag) => ({ tag, ...TOWER_TAG_DETAILS[tag] }))
        .filter(({ Icon }) => Icon);

const formatHeroHeight = (height: number) => {
    if (height < 0) return "výška neznámá";
    return `${height} m`;
};

const formatHeroStairs = (stairs: number) => {
    if (stairs < 0) return "schody neznámé";
    if (stairs === 1) return "1 schod";
    if (stairs >= 2 && stairs <= 4) return `${stairs} schody`;
    return `${stairs} schodů`;
};

const formatHeroVisits = (visits: number) => {
    if (visits === 1) return "1 návštěva";
    if (visits >= 2 && visits <= 4) return `${visits} návštěvy`;
    return `${visits} návštěv`;
};

const formatHeroElevation = (elevation: number) => {
    if (elevation < 0) return "n. m. neznámá";
    return `${elevation} m n. m.`;
};

const formatHeroAccess = (tower: Tower) => {
    const openingHours = normalizeOpeningHours(tower.openingHours);

    switch (openingHours.type) {
        case OpeningHoursType.NonStop:
            return openingHours.isLockedAtNight ? "Zamyká se přes noc" : "Volně přístupná";
        case OpeningHoursType.Forbidden:
            if (openingHours.forbiddenType === OpeningHoursForbiddenType.Reconstruction) {
                return "V rekonstrukci";
            }
            if (openingHours.forbiddenType === OpeningHoursForbiddenType.Temporary) {
                return "Dočasně uzavřena";
            }
            return "Nepřístupná";
        case OpeningHoursType.Occasionally:
            return "Příležitostně";
        case OpeningHoursType.WillOpen:
            return "Bude zpřístupněna";
        case OpeningHoursType.EveryMonth:
        case OpeningHoursType.SomeMonths:
            return "Dle otevírací doby";
        case OpeningHoursType.Unknown:
        default:
            return "Ověřit před návštěvou";
    }
};

async function TowerPage({ params }: { params: Promise<{ type: string; nameID: string }> }) {
    const { type, nameID } = await params;
    const tower = await getTowerObjectByNameID(nameID);
    if (!tower) notFound();
    if (!isCanonicalTowerType(type, tower)) {
        permanentRedirect(getCanonicalTowerPath(tower));
    }
    const [towerImages, towerUserImages, nearbyTowers, { count, avg }, { count: visitsCount }] =
        await Promise.all([
            getUrlsTowerGallery(tower.id),
            listTowerPhotos(tower.id),
            getNearestTowers(tower.id, tower.gps.latitude, tower.gps.longitude),
            getTowerRatingAndCount(tower.id),
            getTowerVisitsCount(tower.id),
        ]);
    const heroDescription = getTowerHeroDescription(tower);
    const seoDescription = getTowerSeoDescription(tower);
    const towerHeroTags = getTowerHeroTags(tower);
    const countyLabel = formatCountyName(tower.county);
    const provinceLabel = formatProvinceName(tower.country, tower.province);
    const towerUrl = `${SITE_URL}${getCanonicalTowerPath(tower)}`;
    const jsonLd = getTowerJsonLd({
        tower,
        url: towerUrl,
        description: seoDescription,
        images: towerImages,
        countyLabel,
        provinceLabel,
    });

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
            />
            <div className="w-full px-4">
                <div className="mx-auto grid w-full max-w-[1720px] gap-4 2xl:grid-cols-[minmax(8rem,1fr)_minmax(0,80rem)_minmax(8rem,1fr)]">
                    <aside
                        aria-hidden="true"
                        className="invisible mt-4 hidden h-96 self-start 2xl:sticky 2xl:top-20 2xl:block"
                    />

                    <div className="min-w-0">
                        <div className="mx-auto mt-4 w-full max-w-7xl">
                            <Carousel
                                images={towerImages}
                                userImages={towerUserImages}
                                tower={tower}
                            >
                                <div className="flex h-full max-w-xl flex-col gap-6">
                                    <div className="hidden text-xs opacity-60 sm:block [&_.breadcrumbs]:text-xs [&_.breadcrumbs]:text-base-content [&_.breadcrumbs_a]:text-base-content [&_.breadcrumbs_a:hover]:text-base-content">
                                        <LocationBreadcrumbs tower={tower} />
                                    </div>

                                    <div className="flex flex-col gap-3 lg:my-auto">
                                        <div className="flex flex-col gap-1">
                                            <h1 className="m-0 text-3xl font-bold leading-tight text-base-content sm:text-5xl">
                                                {tower.name}
                                            </h1>
                                            <TowerAliases
                                                aliases={tower.aliases}
                                                className="m-0 text-base text-base-content/70"
                                            />
                                        </div>
                                        <div className="flex max-h-24 flex-wrap gap-2 overflow-hidden text-xs font-semibold text-base-content/80 sm:max-h-18 sm:text-sm">
                                            <span className={HERO_TAG_CLASS}>
                                                <Star className="size-3.5 text-amber-500" />
                                                {count ? avg.toFixed(1) : "Bez hodnocení"}
                                            </span>
                                            <span className={HERO_TAG_CLASS}>
                                                <Footprints className="size-3.5 text-primary" />
                                                {formatHeroVisits(visitsCount)}
                                            </span>
                                            <span className={HERO_TAG_CLASS}>
                                                <Unlock className="size-3.5 text-primary" />
                                                {formatHeroAccess(tower)}
                                            </span>
                                            {towerHeroTags.map(({ tag, label, Icon }) => (
                                                <span key={tag} className={HERO_TAG_CLASS}>
                                                    <Icon className="size-3.5 text-primary" />
                                                    {label}
                                                </span>
                                            ))}
                                            <span className={HERO_TAG_CLASS}>
                                                <Ruler className="size-3.5 text-primary" />
                                                {formatHeroHeight(tower.height)}
                                            </span>
                                            <span className={HERO_TAG_CLASS}>
                                                <ListOrdered className="size-3.5 text-primary" />
                                                {formatHeroStairs(tower.stairs)}
                                            </span>
                                            <span className={HERO_TAG_CLASS}>
                                                <Mountain className="size-3.5 text-primary" />
                                                {formatHeroElevation(tower.elevation)}
                                            </span>
                                        </div>

                                        <div className="max-w-lg text-left text-sm leading-relaxed text-base-content/85 sm:text-base lg:text-lg">
                                            {heroDescription ? (
                                                <p>{heroDescription}</p>
                                            ) : (
                                                <Legend tower={tower} />
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-auto flex flex-col gap-4">
                                        <div className="max-w-2xl">
                                            <Buttons tower={tower} />
                                        </div>
                                    </div>
                                </div>
                            </Carousel>
                        </div>

                        <div className="mx-auto mb-6 mt-8 flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-6 sm:mt-10">
                            <PracticalInfo tower={tower} />
                            {tower.history && <HistoryText text={tower.history} />}
                            <RatingFormProvider tower={tower} />
                            <MapProvider>
                                <MapTile tower={tower} nearbyTowers={nearbyTowers} />
                            </MapProvider>
                            <NearbyTowers sourceTower={tower} towers={nearbyTowers} />
                            <Sources tower={tower} />
                            <ChangesHistory tower={tower} />
                            <SuggestCorrectionCta />
                        </div>
                    </div>

                    <aside
                        aria-hidden="true"
                        className="invisible mt-4 hidden h-96 self-start 2xl:sticky 2xl:top-20 2xl:block"
                    />
                </div>
                <SuggestEditModal tower={tower} />
            </div>
        </>
    );
}

export default TowerPage;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ type: string; nameID: string }>;
}): Promise<Metadata> {
    const { nameID } = await params;
    const tower = await getTowerObjectByNameID(nameID);

    if (!tower) {
        return {
            title: "Rozhledna nebyla nalezena",
            description: "Rozhledna nebyla nalezena",
            keywords: ["rozhledna", "pozorovatelna", "věž"],
            openGraph: {
                title: "Rozhledna nebyla nalezena",
                description: "Rozhledna nebyla nalezena",
                url: `${SITE_URL}/rozhledny`,
                siteName: "Rozhlednový svět",
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: "Rozhledna nebyla nalezena",
                description: "Rozhledna nebyla nalezena",
            },
        };
    }
    const seoDescription = getTowerSeoDescription(tower);
    const countyLabel = formatCountyName(tower.county);
    const provinceLabel = formatProvinceName(tower.country, tower.province);
    const canonicalPath = getCanonicalTowerPath(tower);

    return {
        title: tower.name,
        description: seoDescription,
        alternates: {
            canonical: `${SITE_URL}${canonicalPath}`,
        },
        keywords: [
            "rozhledna",
            "pozorovatelna",
            "věž",
            tower.type,
            tower.name,
            provinceLabel,
            countyLabel,
        ],
        openGraph: {
            title: `${tower.name} | Rozhlednový svět`,
            images: [
                {
                    url: tower.mainPhotoUrl,
                    alt: tower.name,
                },
            ],
            description: seoDescription,
            url: `${SITE_URL}/${tower.type}/${tower.nameID}`,
            siteName: "Rozhlednový svět",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `${tower.name} | Rozhlednový svět`,
            description: seoDescription,
            images: [
                {
                    url: tower.mainPhotoUrl,
                    alt: tower.name,
                },
            ],
        },
    };
}
