import {
    Binoculars,
    Building2,
    Castle,
    Church,
    CircleAlert,
    CircleHelp,
    Clock,
    Construction,
    Eye,
    Landmark,
    Lock,
    Mountain,
    Shield,
    TowerControl,
    Waves,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";

import UserLevelBadgeButton from "@/components/shared/UserLevelBadgeButton";
import PROVINCES_CZ from "@/constants/provinces/CZ";
import { getTowerTypeName, TowerTypeEnum } from "@/constants/towerType";
import { getCzechTowersForProgress, TowerCollectionDTO } from "@/data/tower/towers-collection";
import { getAllUserVisits } from "@/data/user/user-visits";
import { OpeningHoursForbiddenType, OpeningHoursType } from "@/types/OpeningHours";
import { cn } from "@/utils/cn";
import {
    getAccessibleTowerProgress,
    getTowerProgressPercent,
    getTowerProgressText,
} from "@/utils/towerProgress";
import { getUserLevel } from "@/utils/userLevels";

export const metadata: Metadata = {
    title: "Můj pokrok",
};

const TOWER_TYPE_STYLES = {
    [TowerTypeEnum.ROZHLEDNA]: {
        className:
            "border-emerald-500/70 bg-emerald-500/15 text-emerald-700 in-data-[theme=abyss]:text-emerald-300",
        icon: TowerControl,
    },
    [TowerTypeEnum.VYHLEDNA]: {
        className:
            "border-sky-500/70 bg-sky-500/15 text-sky-700 in-data-[theme=abyss]:text-sky-300",
        icon: Eye,
    },
    [TowerTypeEnum.POZOROVATELNA]: {
        className:
            "border-cyan-500/70 bg-cyan-500/15 text-cyan-700 in-data-[theme=abyss]:text-cyan-300",
        icon: Binoculars,
    },
    [TowerTypeEnum.MESTSKA_VEZ]: {
        className:
            "border-amber-500/70 bg-amber-500/15 text-amber-700 in-data-[theme=abyss]:text-amber-300",
        icon: Building2,
    },
    [TowerTypeEnum.HRADNI_VEZ]: {
        className:
            "border-rose-500/70 bg-rose-500/15 text-rose-700 in-data-[theme=abyss]:text-rose-300",
        icon: Castle,
    },
    [TowerTypeEnum.ZAMECKA_VEZ]: {
        className:
            "border-fuchsia-500/70 bg-fuchsia-500/15 text-fuchsia-700 in-data-[theme=abyss]:text-fuchsia-300",
        icon: Landmark,
    },
    [TowerTypeEnum.KOSTELNI_VEZ]: {
        className:
            "border-violet-500/70 bg-violet-500/15 text-violet-700 in-data-[theme=abyss]:text-violet-300",
        icon: Church,
    },
    [TowerTypeEnum.VODARENSKA_VEZ]: {
        className:
            "border-blue-500/70 bg-blue-500/15 text-blue-700 in-data-[theme=abyss]:text-blue-300",
        icon: Waves,
    },
    [TowerTypeEnum.VOJENSKA_VEZ]: {
        className:
            "border-stone-500/70 bg-stone-500/15 text-stone-700 in-data-[theme=abyss]:text-stone-300",
        icon: Shield,
    },
    [TowerTypeEnum.PRIRODNI_VYHLIDKA]: {
        className:
            "border-lime-500/70 bg-lime-500/15 text-lime-700 in-data-[theme=abyss]:text-lime-300",
        icon: Mountain,
    },
    [TowerTypeEnum.ZAJIMAVOST]: {
        className:
            "border-orange-500/70 bg-orange-500/15 text-orange-700 in-data-[theme=abyss]:text-orange-300",
        icon: Landmark,
    },
};

const numberFormatter = new Intl.NumberFormat("cs-CZ");

const formatTowerCount = (count: number): string => {
    if (count === 1) {
        return "1 rozhledna";
    }

    if (count >= 2 && count <= 4) {
        return `${numberFormatter.format(count)} rozhledny`;
    }

    return `${numberFormatter.format(count)} rozhleden`;
};

const getOpenedTimestamp = (tower: TowerCollectionDTO): number => {
    if (!tower.opened) {
        return Number.MAX_SAFE_INTEGER;
    }

    const timestamp = new Date(tower.opened).getTime();
    return Number.isNaN(timestamp) ? Number.MAX_SAFE_INTEGER : timestamp;
};

const sortByOpened = (firstTower: TowerCollectionDTO, secondTower: TowerCollectionDTO): number => {
    const openedDiff = getOpenedTimestamp(firstTower) - getOpenedTimestamp(secondTower);

    if (openedDiff !== 0) {
        return openedDiff;
    }

    return firstTower.name.localeCompare(secondTower.name, "cs");
};

const isTowerInProvince = (
    tower: TowerCollectionDTO,
    province: (typeof PROVINCES_CZ)[number]
): boolean => {
    return (
        tower.province === province.code ||
        tower.province === province.name ||
        tower.province === province.shortName ||
        province.counties.includes(tower.county)
    );
};

const getAvailabilityMarker = (tower: TowerCollectionDTO) => {
    if (tower.openingHours?.type === OpeningHoursType.Unknown) {
        return {
            icon: CircleHelp,
            label: "Neznámá přístupnost",
            tone: "border border-base-300 bg-base-100 text-base-content/55 in-data-[theme=abyss]:border-base-300/70 in-data-[theme=abyss]:bg-base-200 in-data-[theme=abyss]:text-base-content/60",
        };
    }

    if (tower.openingHours?.type === OpeningHoursType.WillOpen) {
        return { icon: Clock, label: "Zatím není zpřístupněno", tone: "bg-info text-info-content" };
    }

    if (tower.openingHours?.type === OpeningHoursType.Forbidden) {
        if (tower.openingHours.forbiddenType === OpeningHoursForbiddenType.Reconstruction) {
            return {
                icon: Construction,
                label: "Rekonstrukce",
                tone: "bg-warning text-warning-content",
            };
        }

        if (tower.openingHours.forbiddenType === OpeningHoursForbiddenType.Temporary) {
            return {
                icon: Clock,
                label: "Dočasně uzavřeno",
                tone: "bg-warning text-warning-content",
            };
        }

        if (tower.openingHours.forbiddenType === OpeningHoursForbiddenType.Banned) {
            return { icon: Lock, label: "Nepřístupné", tone: "bg-error text-error-content" };
        }

        return {
            icon: CircleAlert,
            label: "Omezená přístupnost",
            tone: "bg-warning text-warning-content",
        };
    }

    return null;
};

function TowerProgressIcon({
    tower,
    visitedTowerIds,
}: {
    tower: TowerCollectionDTO;
    visitedTowerIds: Set<string>;
}) {
    const isVisited = visitedTowerIds.has(tower.id);
    const typeStyle = TOWER_TYPE_STYLES[tower.type] ?? TOWER_TYPE_STYLES[TowerTypeEnum.ROZHLEDNA];
    const TowerIcon = typeStyle.icon;
    const availabilityMarker = getAvailabilityMarker(tower);
    const AvailabilityIcon = availabilityMarker?.icon;
    const labelParts = [
        tower.name,
        getTowerTypeName(tower.type),
        isVisited ? "navštíveno" : "nenavštíveno",
    ];

    if (availabilityMarker) {
        labelParts.push(availabilityMarker.label.toLowerCase());
    }

    const href = `/${tower.type}/${tower.nameID}`;

    return (
        <Link
            aria-label={labelParts.join(", ")}
            className={cn(
                "relative flex size-9 items-center justify-center rounded-sm border transition hover:scale-110 hover:shadow-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-100 sm:size-10",
                typeStyle.className,
                !isVisited &&
                    "border-base-300 bg-base-200/70 text-base-content/45 hover:text-base-content/70 in-data-[theme=abyss]:border-base-300/70 in-data-[theme=abyss]:bg-base-200/40 in-data-[theme=abyss]:text-base-content/35 in-data-[theme=abyss]:hover:text-base-content/55",
                availabilityMarker && "border-dashed"
            )}
            href={href}
            title={labelParts.join(" - ")}
        >
            <TowerIcon aria-hidden="true" size={19} strokeWidth={2.3} />
            {isVisited ? (
                <span className="absolute -right-1 -top-1 flex size-3 items-center justify-center rounded-full bg-success text-success-content ring-1 ring-base-100">
                    <span className="sr-only">Navštíveno</span>
                </span>
            ) : null}
            {availabilityMarker && AvailabilityIcon ? (
                <span
                    className={cn(
                        "absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full ring-1 ring-base-100",
                        availabilityMarker.tone
                    )}
                    title={availabilityMarker.label}
                >
                    <AvailabilityIcon aria-hidden="true" size={11} strokeWidth={2.6} />
                    <span className="sr-only">{availabilityMarker.label}</span>
                </span>
            ) : null}
        </Link>
    );
}

function ProgressLegend() {
    const typeLegendItems = Object.values(TowerTypeEnum).map((type) => {
        const typeStyle = TOWER_TYPE_STYLES[type] ?? TOWER_TYPE_STYLES[TowerTypeEnum.ROZHLEDNA];
        const TypeIcon = typeStyle.icon;

        return { label: getTowerTypeName(type), TypeIcon, typeStyle };
    });

    const availabilityLegendItems = [
        {
            Icon: CircleHelp,
            label: "Neznámá přístupnost",
            tone: "border border-base-300 bg-base-100 text-base-content/55 in-data-[theme=abyss]:border-base-300/70 in-data-[theme=abyss]:bg-base-200 in-data-[theme=abyss]:text-base-content/60",
        },
        { Icon: Clock, label: "Zatím není zpřístupněno", tone: "bg-info text-info-content" },
        { Icon: Construction, label: "Rekonstrukce", tone: "bg-warning text-warning-content" },
        { Icon: Clock, label: "Dočasně uzavřeno", tone: "bg-warning text-warning-content" },
    ];

    return (
        <section className="rounded-lg border border-base-300 bg-base-100 p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-bold sm:text-xl">Legenda</h2>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                <div>
                    <h3 className="mb-2 text-sm font-semibold uppercase text-base-content/60">
                        Typ objektu
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {typeLegendItems.map(({ label, TypeIcon, typeStyle }) => (
                            <div className="flex items-center gap-2 text-sm" key={label}>
                                <span
                                    className={cn(
                                        "flex size-8 items-center justify-center rounded-sm border",
                                        typeStyle.className
                                    )}
                                >
                                    <TypeIcon aria-hidden="true" size={17} strokeWidth={2.3} />
                                </span>
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                    <div>
                        <h3 className="mb-2 text-sm font-semibold uppercase text-base-content/60">
                            Návštěva
                        </h3>
                        <div className="flex flex-wrap gap-3 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="relative flex size-8 items-center justify-center rounded-sm border border-emerald-500/70 bg-emerald-500/15 text-emerald-700 in-data-[theme=abyss]:text-emerald-300">
                                    <TowerControl aria-hidden="true" size={17} strokeWidth={2.3} />
                                    <span className="absolute -right-1 -top-1 size-3 rounded-full bg-success ring-1 ring-base-100" />
                                </span>
                                <span>Navštíveno</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="flex size-8 items-center justify-center rounded-sm border border-base-300 bg-base-200/70 text-base-content/45 in-data-[theme=abyss]:border-base-300/70 in-data-[theme=abyss]:bg-base-200/40 in-data-[theme=abyss]:text-base-content/35">
                                    <TowerControl aria-hidden="true" size={17} strokeWidth={2.3} />
                                </span>
                                <span>Nenavštíveno</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-2 text-sm font-semibold uppercase text-base-content/60">
                            Přístupnost
                        </h3>
                        <div className="flex flex-wrap gap-3 text-sm">
                            {availabilityLegendItems.map(({ Icon, label, tone }) => (
                                <div className="flex items-center gap-2" key={label}>
                                    <span
                                        className={cn(
                                            "flex size-5 items-center justify-center rounded-full ring-1 ring-base-100",
                                            tone
                                        )}
                                    >
                                        <Icon aria-hidden="true" size={12} strokeWidth={2.6} />
                                    </span>
                                    <span>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function UserLevelProgress({ visitsCount }: { visitsCount: number }) {
    const userLevel = getUserLevel(visitsCount);

    return (
        <section className="rounded-lg border border-base-300 bg-base-100 p-4 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase text-base-content/60">
                        Uživatelská úroveň
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                        <UserLevelBadgeButton
                            color={userLevel.color}
                            name={userLevel.name}
                            textColor={userLevel.textColor}
                        />
                        {userLevel.nextLevel ? (
                            <span className="text-sm font-semibold text-base-content/70">
                                Další úroveň: {userLevel.nextLevel.name}
                            </span>
                        ) : null}
                    </div>
                    <p className="mt-3 text-sm text-base-content/70">
                        {userLevel.nextLevel
                            ? `Zbývá už jen ${formatTowerCount(userLevel.remainingVisits)}.`
                            : "Máte nejvyšší úroveň."}
                    </p>
                </div>
                <div className="text-left md:text-right">
                    <div className="text-3xl font-bold leading-none">
                        {numberFormatter.format(userLevel.visits)} /{" "}
                        {numberFormatter.format(userLevel.nextLevelVisits)}
                    </div>
                    <div className="mt-1 text-sm text-base-content/60">návštěv k titulu</div>
                </div>
            </div>
            <div
                aria-label="Pokrok k další uživatelské úrovni"
                aria-valuemax={userLevel.nextLevelVisits}
                aria-valuemin={0}
                aria-valuenow={userLevel.visits}
                className="mt-4 h-3 w-full overflow-hidden rounded-full bg-base-300"
                role="progressbar"
            >
                <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${userLevel.progressPercent}%` }}
                />
            </div>
        </section>
    );
}

function ProgressContent({
    towers,
    visitedTowerIds,
}: {
    towers: TowerCollectionDTO[];
    visitedTowerIds: Set<string>;
}) {
    const {
        accessibleTowers,
        progressPercent,
        progressText,
        totalAccessibleCount,
        visitedAccessibleCount,
    } = getAccessibleTowerProgress(towers, visitedTowerIds);
    const provinceSections = PROVINCES_CZ.map((province) => {
        const provinceTowers = accessibleTowers
            .filter((tower) => isTowerInProvince(tower, province))
            .sort(sortByOpened);
        const provinceVisitedCount = provinceTowers.filter((tower) =>
            visitedTowerIds.has(tower.id)
        ).length;
        const progressPercent = getTowerProgressPercent(
            provinceVisitedCount,
            provinceTowers.length
        );

        return {
            progressPercent,
            province,
            provinceTowers,
            provinceVisitedCount,
        };
    })
        .filter((section) => section.provinceTowers.length > 0)
        .sort((firstSection, secondSection) => {
            const progressDiff = secondSection.progressPercent - firstSection.progressPercent;

            if (progressDiff !== 0) {
                return progressDiff;
            }

            return firstSection.province.name.localeCompare(secondSection.province.name, "cs");
        });

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-3 py-8 xl:px-0">
            <article className="prose max-w-3xl">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl">Můj pokrok</h1>
                <p className="text-sm sm:text-base lg:text-lg">
                    Přehled navštívených přístupných rozhleden v Česku. Zaniklé a trvale uzavřené
                    objekty tu nejsou, místa s neznámou nebo dočasně omezenou přístupností zůstávají
                    ve sbírce i v procentuálním pokroku.
                </p>
            </article>

            <section className="stats w-fit max-w-full flex-wrap shadow-sm">
                <div className="stat w-44">
                    <div className="stat-title">Pokrok</div>
                    <div className="stat-value">{progressText}</div>
                    <div className="stat-desc">přístupných objektů</div>
                </div>
                <div className="stat w-44">
                    <div className="stat-title">Navštíveno</div>
                    <div className="stat-value">{visitedAccessibleCount}</div>
                    <div className="stat-desc">z {totalAccessibleCount}</div>
                </div>
                <div className="stat min-w-44">
                    <div className="stat-title">Zobrazeno</div>
                    <div className="stat-value">{totalAccessibleCount}</div>
                    <div className="stat-desc">objektů v ČR</div>
                </div>
            </section>

            <div
                aria-label="Celkový průběh"
                aria-valuemax={totalAccessibleCount}
                aria-valuemin={0}
                aria-valuenow={visitedAccessibleCount}
                className="h-3 w-full overflow-hidden rounded-full bg-base-300"
                role="progressbar"
            >
                <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            <UserLevelProgress visitsCount={visitedAccessibleCount} />

            <div className="grid gap-5">
                {provinceSections.map(({ province, provinceTowers, provinceVisitedCount }) => {
                    return (
                        <section
                            className="rounded-lg border border-base-300 bg-base-100 p-4 shadow-sm"
                            key={province.code}
                        >
                            <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
                                <div>
                                    <h2 className="text-lg font-bold sm:text-xl">
                                        {province.name}
                                    </h2>
                                    <p className="text-sm text-base-content/65">
                                        {provinceVisitedCount} / {provinceTowers.length} přístupných
                                    </p>
                                </div>
                                <div className="text-sm font-semibold text-base-content/70">
                                    {getTowerProgressText(
                                        provinceVisitedCount,
                                        provinceTowers.length
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {provinceTowers.map((tower) => (
                                    <TowerProgressIcon
                                        key={tower.id}
                                        tower={tower}
                                        visitedTowerIds={visitedTowerIds}
                                    />
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>

            <ProgressLegend />
        </div>
    );
}

async function ProgressPage() {
    await connection();

    const [towers, visits] = await Promise.all([getCzechTowersForProgress(), getAllUserVisits()]);
    const visitedTowerIds = new Set(visits.map((visit) => visit.tower_id));

    return <ProgressContent towers={towers} visitedTowerIds={visitedTowerIds} />;
}

export default ProgressPage;
