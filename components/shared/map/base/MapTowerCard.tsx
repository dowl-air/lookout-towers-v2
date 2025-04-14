import { Tower } from "@/types/Tower";
import { cn } from "@/utils/cn";
import { formatDateYear } from "@/utils/date";
import { getOpeningHoursStateAndShortText } from "@/utils/openingHours";
import Image from "next/image";
import Link from "next/link";

const MapTowerCard = ({ tower, isFavourite = false, isVisited = false }: { tower: Tower; isFavourite?: boolean; isVisited?: boolean }) => {
    const [state, openingHoursText] = getOpeningHoursStateAndShortText(tower.openingHours);
    return (
        <Link href={`/${tower.type || "rozhledna"}/${tower.nameID}`} scroll>
            <div className="card card-compact cursor-pointer w-[225px] rounded-none">
                <figure className="object-cover inline-block relative h-72">
                    <Image
                        src={tower.mainPhotoUrl}
                        alt={tower.name}
                        fill
                        priority={false}
                        className="object-cover object-top block"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        unoptimized
                    />

                    <div className="absolute top-0 left-3 flex gap-2">
                        {isVisited ? (
                            <span className="bg-white p-1 rounded-b-full" title="Navštíveno">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#1dad44"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                                    <path d="m9 10 2 2 4-4" />
                                </svg>
                            </span>
                        ) : null}
                        {isFavourite ? (
                            <span className="bg-white p-1 rounded-b-full" title="V oblíbených">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#F9BC0D"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                                </svg>
                            </span>
                        ) : null}
                    </div>

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
                            className={cn("badge badge-sm lg:badge-md absolute bottom-2 right-1.5 font-bold border-white", {
                                "badge-success": state === true,
                                "badge-error": state === false,
                            })}
                        >
                            {openingHoursText}
                        </div>
                    ) : null}
                </figure>

                <div className="card-body py-3! px-3! gap-0">
                    <h2 className="card-title whitespace-nowrap overflow-hidden text-ellipsis block text-xl text-black">{tower.name}</h2>
                    {/* <div className="flex items-center gap-2">
                        <ThemedRating size={20} value={avg} />
                        <div className="text-base text-gray-400 mt-0.5">{count}x</div>
                    </div> */}
                    <div className="flex justify-between items-center mt-2">
                        <div className="flex-row flex items-center">
                            <svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" className="w-5">
                                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                    <g fill="#000000" transform="translate(106.666667, 42.666667)">
                                        <path d="M149.333333,7.10542736e-15 C231.807856,7.10542736e-15 298.666667,66.8588107 298.666667,149.333333 C298.666667,176.537017 291.413333,202.026667 278.683512,224.008666 C270.196964,238.663333 227.080238,313.32711 149.333333,448 C71.5864284,313.32711 28.4697022,238.663333 19.9831547,224.008666 C7.25333333,202.026667 2.84217094e-14,176.537017 2.84217094e-14,149.333333 C2.84217094e-14,66.8588107 66.8588107,7.10542736e-15 149.333333,7.10542736e-15 Z M149.333333,85.3333333 C113.987109,85.3333333 85.3333333,113.987109 85.3333333,149.333333 C85.3333333,184.679557 113.987109,213.333333 149.333333,213.333333 C184.679557,213.333333 213.333333,184.679557 213.333333,149.333333 C213.333333,113.987109 184.679557,85.3333333 149.333333,85.3333333 Z"></path>
                                    </g>
                                </g>
                            </svg>
                            <div className="ml-0.5 md:ml-1 text-base text-black">{tower.county}</div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MapTowerCard;
