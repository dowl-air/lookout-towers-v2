import { getTowerRatingAndCount } from "@/actions/towers/towers.action";
import Image from "next/image";
import Link from "next/link";
import ThemedRating from "./ThemedRating";
import { getOpeningHoursStateAndShortText } from "@/utils/openingHours";
import { cn } from "@/utils/cn";
import { formatDateYear } from "@/utils/date";
import TowerCardLocation from "@/components/shared/TowerCardLocation";
import { Tower } from "@/types/Tower";

const TowerCard = async ({ tower, priority = false }: { tower: Tower; priority?: boolean }) => {
    const { avg, count } = await getTowerRatingAndCount(tower.id);
    const [state, openingHoursText] = getOpeningHoursStateAndShortText(tower.openingHours);
    return (
        <Link href={`/${tower.type}/${tower.nameID}`}>
            <div className="card card-compact w-full mx-auto transition-transform duration-200 cursor-pointer hover:scale-105 ">
                <figure className="object-cover inline-block relative h-52 sm:h-60 md:h-72">
                    <Image
                        src={tower.mainPhotoUrl}
                        alt={tower.name}
                        fill
                        priority={priority}
                        className="object-cover block"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        unoptimized
                    />
                    {tower.opened ? (
                        <span
                            className={cn(
                                "badge badge-sm lg:badge-md absolute bottom-7 lg:bottom-8 right-2 text-white font-bold bg-black bg-opacity-50 border-white",
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
                            className={cn("badge badge-sm lg:badge-md absolute bottom-2 right-2 font-bold border-white", {
                                "badge-success": state === true,
                                "badge-error": state === false,
                            })}
                        >
                            {openingHoursText}
                        </div>
                    ) : null}
                </figure>
                <div className="card-body !px-3 md:!py-2 lg:!py-3 gap-0">
                    <h2 className="card-title whitespace-nowrap overflow-hidden overflow-ellipsis block text-base sm:text-lg md:text-xl">
                        {tower.name}
                    </h2>
                    <div className="flex flex-row items-center">
                        <ThemedRating size={20} value={avg} />
                        <div className="flex lg:gap-1 text-md text-gray-400 ml-2">{count}x</div>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                        <div className="flex-row flex items-center">
                            <svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" className="w-5">
                                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                    <g fill="currentColor" transform="translate(106.666667, 42.666667)">
                                        <path d="M149.333333,7.10542736e-15 C231.807856,7.10542736e-15 298.666667,66.8588107 298.666667,149.333333 C298.666667,176.537017 291.413333,202.026667 278.683512,224.008666 C270.196964,238.663333 227.080238,313.32711 149.333333,448 C71.5864284,313.32711 28.4697022,238.663333 19.9831547,224.008666 C7.25333333,202.026667 2.84217094e-14,176.537017 2.84217094e-14,149.333333 C2.84217094e-14,66.8588107 66.8588107,7.10542736e-15 149.333333,7.10542736e-15 Z M149.333333,85.3333333 C113.987109,85.3333333 85.3333333,113.987109 85.3333333,149.333333 C85.3333333,184.679557 113.987109,213.333333 149.333333,213.333333 C184.679557,213.333333 213.333333,184.679557 213.333333,149.333333 C213.333333,113.987109 184.679557,85.3333333 149.333333,85.3333333 Z"></path>
                                    </g>
                                </g>
                            </svg>
                            <div className="ml-0.5 md:ml-1 text-sm lg:text-base">{tower.county}</div>
                        </div>
                        <TowerCardLocation tower={tower} />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default TowerCard;
