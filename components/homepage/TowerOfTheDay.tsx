import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import ThemedRating from "@/components/shared/ThemedRating";
import TowerFavouriteAction from "@/components/shared/TowerFavouriteAction";
import TowerVisitAction from "@/components/shared/TowerVisitAction";
import { towerTypes } from "@/constants/towerType";
import { getTowerOfTheDay } from "@/data/tower/tower-of-the-day";
import { getTowerRatingAndCount, getTowerVisitsCount } from "@/data/tower/towers";
import { getMostRecentTowerVisit } from "@/data/user/user-visits";
import { formatDate } from "@/utils/date";
import { getOpeningHoursStateAndShortText } from "@/utils/openingHours";

export const revalidate = 3600;

const MATERIAL_GENITIVE_MAP: Record<string, string> = {
    beton: "betonu",
    dřevo: "dřeva",
    kámen: "kamene",
    kov: "kovu",
    netradiční: "netradičních materiálů",
    zdivo: "zdiva",
};

function joinCzechList(items: string[]) {
    if (items.length === 0) {
        return "";
    }

    if (items.length === 1) {
        return items[0];
    }

    if (items.length === 2) {
        return `${items[0]} a ${items[1]}`;
    }

    return `${items.slice(0, -1).join(", ")} a ${items[items.length - 1]}`;
}

function formatObservationDecks(count?: number) {
    if (!count) {
        return null;
    }

    if (count === 1) {
        return "Má 1 vyhlídkovou plošinu";
    }

    if (count >= 2 && count <= 4) {
        return `Má ${count} vyhlídkové plošiny`;
    }

    return `Má ${count} vyhlídkových plošin`;
}

function TowerOfTheDayActionsFallback() {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <div
                aria-hidden="true"
                className="btn btn-outline btn-sm sm:btn-md h-10 min-h-10 min-w-44 justify-center border-base-300 text-base-content/45 sm:h-12 sm:min-h-12"
            >
                Zapsat návštěvu
            </div>
            <div
                aria-hidden="true"
                className="btn btn-circle btn-sm sm:btn-md h-10 min-h-10 w-10 border border-base-300 bg-base-100 text-base-content/45 sm:h-12 sm:min-h-12 sm:w-12"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="size-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321 1.01l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.386a.562.562 0 0 1-.84.61l-4.725-2.885a.563.563 0 0 0-.586 0L6.982 20.56a.562.562 0 0 1-.84-.61l1.285-5.386a.563.563 0 0 0-.182-.557L3.04 10.405a.562.562 0 0 1 .321-1.01l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                    />
                </svg>
            </div>
        </div>
    );
}

const TowerOfTheDay = async () => {
    const { tower, date } = await getTowerOfTheDay();
    const revalidatePaths = ["/", `/${tower.type}/${tower.nameID}`];
    const towerTypeName =
        towerTypes.find((towerType) => towerType.value === tower.type)?.name ?? tower.type;
    const [, openingHoursText] = getOpeningHoursStateAndShortText(tower.openingHours);
    const openedYear = tower.opened ? new Date(tower.opened).getFullYear() : null;
    const materialsText = tower.material.length
        ? joinCzechList(
              tower.material.map((material) => MATERIAL_GENITIVE_MAP[material] ?? material)
          )
        : null;
    const introSegments = [
        `${tower.name} je ${towerTypeName}`,
        openedYear ? `postavená roku ${openedYear}` : null,
        materialsText ? `z ${materialsText}` : null,
    ].filter(Boolean);
    const detailSegments = [
        formatObservationDecks(tower.observationDecksCount),
        openingHoursText ? `je ${openingHoursText.toLowerCase()}` : null,
    ].filter(Boolean);
    const featuredSentence =
        detailSegments.length > 0
            ? `${introSegments.join(" ")}. ${detailSegments.join(" a ")}.`
            : `${introSegments.join(" ")}.`;

    const [{ avg, count }, { count: visitsCount }, towerRecentVisit] = await Promise.all([
        getTowerRatingAndCount(tower.id),
        getTowerVisitsCount(tower.id),
        getMostRecentTowerVisit(tower.id),
    ]);

    return (
        <section className="mx-auto mt-16 mb-10 w-full max-w-[1070px] px-4">
            <div className="rounded-4xl border border-base-300/70 bg-linear-to-br from-base-200/70 via-base-100 to-base-100 p-6 shadow-2xl md:p-8">
                <div className="mb-6 flex flex-col items-center gap-3 text-center md:mb-8">
                    <h2 className="text-3xl font-bold md:text-4xl">Rozhledna dne</h2>
                    <p className="max-w-2xl text-base text-base-content/75 md:text-lg">
                        Každý den vybíráme jedno místo, které stojí za pozornost. Doporučujeme si ho
                        uložit jako inspiraci na další výlet.
                    </p>
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-base-content/55">
                        Výběr pro {formatDate({ date, long: true })}
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:items-stretch">
                    <Link
                        href={`/${tower.type}/${tower.nameID}`}
                        className="relative block min-h-80 overflow-hidden rounded-3xl bg-base-300 shadow-lg"
                    >
                        <Image
                            src={tower.mainPhotoUrl}
                            alt={tower.name}
                            className="object-cover object-top transition-transform duration-300 hover:scale-[1.03]"
                            fill
                            sizes="(max-width: 768px) 100vw, 40vw"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                            <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/70">
                                {towerTypeName}
                            </p>
                            <h3 className="mt-2 text-3xl font-bold leading-tight">{tower.name}</h3>
                            <p className="mt-2 text-sm text-white/80 md:text-base">
                                {tower.county}
                            </p>
                        </div>
                    </Link>

                    <div className="flex flex-col justify-between p-1 md:p-2">
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-2 rounded-full bg-base-200 px-3 py-2">
                                    <ThemedRating size={24} value={avg} />
                                    <span className="text-sm font-medium text-base-content/75">
                                        {count ? `${count} hodnocení` : "Zatím bez hodnocení"}
                                    </span>
                                </div>
                                <div className="rounded-full bg-base-200 px-3 py-2 text-sm font-medium text-base-content/75">
                                    {visitsCount
                                        ? `${visitsCount} ${visitsCount > 1 ? "návštěv v komunitě" : "návštěva v komunitě"}`
                                        : "Zatím bez zaznamenané návštěvy"}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-lg leading-8 text-base-content/85">
                                    {featuredSentence}
                                </p>
                                {towerRecentVisit ? (
                                    <p className="text-base text-base-content/75">
                                        Poslední zaznamenaná návštěva proběhla{" "}
                                        <span className="font-semibold text-base-content">
                                            {formatDate({
                                                date: towerRecentVisit.date,
                                                long: true,
                                            })}
                                        </span>
                                        .
                                    </p>
                                ) : null}
                            </div>

                            <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                                <div className="rounded-2xl bg-base-200 px-4 py-3">
                                    <dt className="text-base-content/55">Lokalita</dt>
                                    <dd className="mt-1 font-semibold text-base-content">
                                        {tower.county}
                                    </dd>
                                </div>
                                <div className="rounded-2xl bg-base-200 px-4 py-3">
                                    <dt className="text-base-content/55">Výška</dt>
                                    <dd className="mt-1 font-semibold text-base-content">
                                        {tower.height} m
                                    </dd>
                                </div>
                                <div className="rounded-2xl bg-base-200 px-4 py-3">
                                    <dt className="text-base-content/55">Schody</dt>
                                    <dd className="mt-1 font-semibold text-base-content">
                                        {tower.stairs}
                                    </dd>
                                </div>
                                <div className="rounded-2xl bg-base-200 px-4 py-3">
                                    <dt className="text-base-content/55">Otevřeno</dt>
                                    <dd className="mt-1 font-semibold text-base-content">
                                        {new Date(tower.opened).getFullYear()}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <Link
                                href={`/${tower.type}/${tower.nameID}`}
                                className="btn btn-primary h-10 min-h-10 sm:h-12 sm:min-h-12"
                            >
                                Zobrazit detail rozhledny
                            </Link>
                            <Suspense fallback={<TowerOfTheDayActionsFallback />}>
                                <div className="flex flex-wrap items-center gap-3">
                                    <TowerVisitAction
                                        tower={tower}
                                        revalidatePaths={revalidatePaths}
                                        variant="compact"
                                        className="min-w-44 justify-center sm:h-12 sm:min-h-12"
                                        idleLabel="Zapsat návštěvu"
                                    />
                                    <TowerFavouriteAction
                                        towerID={tower.id}
                                        revalidatePaths={revalidatePaths}
                                        variant="icon"
                                        className="h-10 min-h-10 w-10 shrink-0 sm:h-12 sm:min-h-12 sm:w-12"
                                    />
                                </div>
                            </Suspense>
                            <span className="basis-full text-sm text-base-content/60">
                                Otevřete detail informacemi, mapou a komunitní aktivitou.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TowerOfTheDay;
