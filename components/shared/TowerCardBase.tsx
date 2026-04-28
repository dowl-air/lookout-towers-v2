"use client";

import { Clock3, MapPinCheckInside, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import TowerCardLocation from "@/components/shared/TowerCardLocation";
import { Tower } from "@/types/Tower";
import { cn } from "@/utils/cn";

type TowerCardBaseProps = {
    href: string;
    title: string;
    photoUrl: string;
    typeLabel: string;
    placeLabel: string;
    regionLabel: string;
    priority?: boolean;
    scroll?: boolean;
    openingHoursLabel?: string;
    openingHoursState?: boolean | null;
    ratingLabel?: string;
    ratingCount?: number;
    distanceLabel?: string | null;
    distanceGps?: Tower["gps"];
    titleAs?: "h2" | "h3";
    cardClassName?: string;
    imageClassName?: string;
    overlayClassName?: string;
    titleClassName?: string;
    contentClassName?: string;
    distanceClassName?: string;
    footerClassName?: string;
    showVisited?: boolean;
    showFavourite?: boolean;
};

const TowerCardBase = ({
    href,
    title,
    photoUrl,
    typeLabel,
    placeLabel,
    regionLabel,
    priority = false,
    scroll,
    openingHoursLabel,
    openingHoursState,
    ratingLabel,
    ratingCount,
    distanceLabel,
    distanceGps,
    titleAs = "h2",
    cardClassName,
    imageClassName,
    overlayClassName,
    titleClassName,
    contentClassName,
    distanceClassName,
    footerClassName,
    showVisited = false,
    showFavourite = false,
}: TowerCardBaseProps) => {
    const TitleTag = titleAs;
    const hasMetaRow = Boolean(ratingLabel || distanceLabel || distanceGps);

    return (
        <Link href={href} scroll={scroll} className="group block">
            <article
                className={cn(
                    "overflow-hidden rounded-[1.75rem] border border-base-300/70 bg-base-100 shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/10",
                    cardClassName
                )}
            >
                <figure className="relative aspect-4/5 overflow-hidden bg-base-200">
                    <Image
                        src={photoUrl}
                        alt={title}
                        fill
                        priority={priority}
                        className={cn(
                            "block object-cover transition-transform duration-500 group-hover:scale-[1.04]",
                            imageClassName
                        )}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

                    {openingHoursLabel ? (
                        <span
                            className={cn(
                                "absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/92 px-3 py-1.5 text-[11px] font-semibold shadow-sm backdrop-blur-xs",
                                {
                                    "text-emerald-700": openingHoursState === true,
                                    "text-rose-700": openingHoursState === false,
                                    "text-slate-700": openingHoursState == null,
                                }
                            )}
                        >
                            <Clock3 className="size-3.5" />
                            {openingHoursLabel}
                        </span>
                    ) : null}

                    {showVisited || showFavourite ? (
                        <div className="absolute right-3 top-3 flex gap-2">
                            {showVisited ? (
                                <span
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/92 shadow-sm backdrop-blur-xs"
                                    title="Navštíveno"
                                >
                                    <MapPinCheckInside className="size-4.5 text-emerald-600" />
                                </span>
                            ) : null}

                            {showFavourite ? (
                                <span
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/92 shadow-sm backdrop-blur-xs"
                                    title="V oblíbených"
                                >
                                    <Star className="size-4.5 fill-amber-400 text-amber-400" />
                                </span>
                            ) : null}
                        </div>
                    ) : null}

                    <div
                        className={cn(
                            "absolute inset-x-0 bottom-0 p-4 text-white",
                            overlayClassName
                        )}
                    >
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                            {typeLabel}
                        </p>
                        <TitleTag
                            className={cn(
                                "mt-2 line-clamp-2 text-xl font-semibold leading-tight sm:text-2xl",
                                titleClassName
                            )}
                        >
                            {title}
                        </TitleTag>
                    </div>
                </figure>

                <div className={cn("flex flex-col gap-3 p-4", contentClassName)}>
                    {hasMetaRow ? (
                        <div className="flex items-center justify-between gap-2 overflow-hidden">
                            {ratingLabel ? (
                                <div className="inline-flex min-w-0 shrink items-center gap-2 rounded-full border border-amber-300/80 bg-amber-100 px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/15 dark:text-amber-300 sm:text-sm">
                                    <Star
                                        className={cn("size-3.5 shrink-0 sm:size-4", {
                                            "fill-current": Boolean(ratingCount),
                                        })}
                                    />
                                    <span className="truncate text-base-content/50">
                                        {ratingLabel}
                                    </span>
                                    {ratingCount ? (
                                        <span className="text-base-content/50">
                                            ({ratingCount})
                                        </span>
                                    ) : null}
                                </div>
                            ) : (
                                <div />
                            )}

                            {distanceLabel ? (
                                <div
                                    className={cn(
                                        "inline-flex shrink-0 items-center gap-2 rounded-full bg-base-200 px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-base-content/75 sm:text-sm",
                                        distanceClassName
                                    )}
                                >
                                    {distanceLabel}
                                </div>
                            ) : distanceGps ? (
                                <TowerCardLocation
                                    gps={distanceGps}
                                    className={cn(
                                        "shrink-0 rounded-full bg-base-200 px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-base-content/75 sm:text-sm",
                                        distanceClassName
                                    )}
                                />
                            ) : null}
                        </div>
                    ) : null}

                    <div className={cn("min-w-0 text-sm text-base-content/65", footerClassName)}>
                        <p className="truncate font-medium text-base-content/75">{placeLabel}</p>
                        <p className="truncate text-xs uppercase tracking-[0.16em] text-base-content/45">
                            {regionLabel}
                        </p>
                    </div>
                </div>
            </article>
        </Link>
    );
};

export default TowerCardBase;
