"use client";

import Link from "next/link";
import Image from "next/image";
import ThemedRating from "@/components/shared/ThemedRating";
import { formatDateYear } from "@/utils/date";
import { getOpeningHoursStateAndShortText } from "@/utils/openingHours";
import { cn } from "@/utils/cn";
import { getDistance } from "geolib";
import { formatDistance } from "@/utils/geo";
import { Tower } from "@/types/Tower";

function TowerCardClient({
    tower,
    priority = false,
    avg,
    count,
    photoUrl,
    userLocation,
}: {
    tower: Tower;
    priority?: boolean;
    avg: number;
    count: number;
    photoUrl: string;
    userLocation: { latitude: number; longitude: number } | null;
}) {
    const [state, openingHoursText] = getOpeningHoursStateAndShortText(tower.openingHours);
    const locationDistance = userLocation ? getDistance(userLocation, tower.gps, 100) : null;

    return (
        <Link href={`/${tower.type || "rozhledna"}/${tower.nameID}`} scroll>
            <article className="card card-compact w-full max-w-[19rem] mx-auto overflow-hidden rounded-2xl bg-base-100 shadow-lg transition-transform duration-200 cursor-pointer hover:scale-105 sm:max-w-none min-[437px]:w-36 sm:w-40 md:w-44 lg:w-56">
                <figure className="object-cover inline-block relative h-56 min-[437px]:h-52 sm:h-60 md:h-72">
                    <Image
                        src={photoUrl}
                        alt={tower.name}
                        fill
                        priority={priority}
                        className="object-cover block"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    {tower.opened ? (
                        <span
                            className={cn(
                                "badge badge-sm lg:badge-md absolute bottom-7.5 lg:bottom-8.5 right-1.5 text-white font-bold bg-black! bg-opacity-50 border-white",
                                {
                                    "bottom-2 lg:bottom-2": openingHoursText === "",
                                }
                            )}
                        >
                            {formatDateYear({ date: tower.opened })}
                        </span>
                    ) : null}
                    {openingHoursText !== "" ? (
                        <div
                            className={cn(
                                "badge badge-sm lg:badge-md absolute bottom-2 right-1.5 font-bold border-white",
                                {
                                    "badge-success": state === true,
                                    "badge-error": state === false,
                                }
                            )}
                        >
                            {openingHoursText}
                        </div>
                    ) : null}
                </figure>
                <div className="card-body gap-2 px-3! py-3! md:px-3! md:py-3!">
                    <h3 className="card-title block text-base leading-tight sm:text-lg md:text-xl line-clamp-2">
                        {tower.name}
                    </h3>
                    <div className="flex items-center gap-2">
                        <ThemedRating size={20} value={avg} />
                        <div className="mt-0.5 text-sm text-base-content/60 sm:text-base">
                            {count}x
                        </div>
                    </div>
                    <div className="mt-1 flex flex-col gap-1 text-sm text-base-content/75 min-[437px]:flex-row min-[437px]:items-center min-[437px]:justify-between sm:text-base">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <svg
                                viewBox="0 0 512 512"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5"
                            >
                                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                    <g
                                        fill="currentColor"
                                        transform="translate(106.666667, 42.666667)"
                                    >
                                        <path d="M149.333333,7.10542736e-15 C231.807856,7.10542736e-15 298.666667,66.8588107 298.666667,149.333333 C298.666667,176.537017 291.413333,202.026667 278.683512,224.008666 C270.196964,238.663333 227.080238,313.32711 149.333333,448 C71.5864284,313.32711 28.4697022,238.663333 19.9831547,224.008666 C7.25333333,202.026667 2.84217094e-14,176.537017 2.84217094e-14,149.333333 C2.84217094e-14,66.8588107 66.8588107,7.10542736e-15 149.333333,7.10542736e-15 Z M149.333333,85.3333333 C113.987109,85.3333333 85.3333333,113.987109 85.3333333,149.333333 C85.3333333,184.679557 113.987109,213.333333 149.333333,213.333333 C184.679557,213.333333 213.333333,184.679557 213.333333,149.333333 C213.333333,113.987109 184.679557,85.3333333 149.333333,85.3333333 Z"></path>
                                    </g>
                                </g>
                            </svg>
                            <div className="min-w-0 truncate">{tower.county}</div>
                        </div>
                        {locationDistance !== null ? (
                            <div className="whitespace-nowrap font-medium text-base-content/70">
                                {formatDistance(locationDistance)}
                            </div>
                        ) : null}
                    </div>
                </div>
            </article>
        </Link>
    );
}

export default TowerCardClient;
