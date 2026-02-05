import { MapPinCheckInside, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import TowerCardLocation from "@/components/shared/TowerCardLocation";
import { TowerMapDTO } from "@/data/tower/towers-map";
import { cn } from "@/utils/cn";
import { formatDateYear } from "@/utils/date";
import { getOpeningHoursStateAndShortText } from "@/utils/openingHours";

interface MapTowerCardProps {
    tower: TowerMapDTO;
}

const MapTowerCard = ({ tower }: MapTowerCardProps) => {
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
                    />

                    <div className="absolute top-0 left-3 flex gap-2">
                        {tower.isVisited ? (
                            <span className="bg-white p-1 rounded-b-full" title="Navštíveno">
                                <MapPinCheckInside stroke="#1dad44" />
                            </span>
                        ) : null}
                        {tower.isFavourite ? (
                            <span className="bg-white p-1 rounded-b-full" title="V oblíbených">
                                <Star stroke="#F9BC0D" />
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

                <div className="card-body py-3! px-3! gap-0">
                    <h2 className="card-title whitespace-nowrap overflow-hidden text-ellipsis block text-xl text-black">
                        {tower.name}
                    </h2>
                    <div className="flex justify-between items-center mt-2">
                        <div className="flex-row flex items-center">
                            <svg viewBox="0 0 512 512" className="w-5">
                                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                    <g fill="#000000" transform="translate(106.666667, 42.666667)">
                                        <path d="M149.333333,7.10542736e-15 C231.807856,7.10542736e-15 298.666667,66.8588107 298.666667,149.333333 C298.666667,176.537017 291.413333,202.026667 278.683512,224.008666 C270.196964,238.663333 227.080238,313.32711 149.333333,448 C71.5864284,313.32711 28.4697022,238.663333 19.9831547,224.008666 C7.25333333,202.026667 2.84217094e-14,176.537017 2.84217094e-14,149.333333 C2.84217094e-14,66.8588107 66.8588107,7.10542736e-15 149.333333,7.10542736e-15 Z M149.333333,85.3333333 C113.987109,85.3333333 85.3333333,113.987109 85.3333333,149.333333 C85.3333333,184.679557 113.987109,213.333333 149.333333,213.333333 C184.679557,213.333333 213.333333,184.679557 213.333333,149.333333 C213.333333,113.987109 184.679557,85.3333333 149.333333,85.3333333 Z"></path>
                                    </g>
                                </g>
                            </svg>
                            <div className="ml-0.5 md:ml-1 text-base text-black">
                                {tower.county}
                            </div>
                        </div>
                        <TowerCardLocation tower={tower} />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MapTowerCard;
