import Link from "next/link";
import Image from "next/image";

import { Tower } from "@/typings";
import ThemedRating from "@/components/shared/ThemedRating";

function TowerCardClient({
    tower,
    priority = false,
    avg,
    count,
    photoUrl,
}: {
    tower: Tower;
    priority?: boolean;
    avg: number;
    count: number;
    photoUrl: string;
}) {
    return (
        <Link href={`/${tower.type || "rozhledna"}/${tower.nameID}`} scroll>
            <div className="card card-compact min-[437px]:w-36 sm:w-40 md:w-44 lg:w-56 mx-auto transition-transform duration-200 cursor-pointer hover:scale-105 ">
                <figure className="object-cover inline-block relative h-60 min-[437px]:h-52 sm:h-60 md:h-72">
                    <Image
                        src={photoUrl}
                        alt={tower.name}
                        fill
                        priority={priority}
                        className="object-cover block"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        unoptimized
                    />
                    {tower.opened ? (
                        <div className="badge absolute bottom-2 left-2 text-white bg-transparent border-white">
                            {new Date(tower.opened).getFullYear()}
                        </div>
                    ) : null}
                </figure>
                <div className="card-body !px-1 !py-2 md:!py-3 md:!px-3 gap-0">
                    <h2 className="card-title whitespace-nowrap overflow-hidden overflow-ellipsis block text-base sm:text-lg md:text-xl">
                        {tower.name}
                    </h2>
                    <div className="flex items-center gap-2">
                        <ThemedRating size={20} value={avg} />
                        <div className="text-base text-gray-400 mt-0.5">{count}x</div>
                    </div>

                    <div className="mt-2 flex-row flex items-center">
                        <svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" className="w-5">
                            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <g id="location-outline" fill="currentColor" transform="translate(106.666667, 42.666667)">
                                    <path
                                        d="M149.333333,7.10542736e-15 C231.807856,7.10542736e-15 298.666667,66.8588107 298.666667,149.333333 C298.666667,176.537017 291.413333,202.026667 278.683512,224.008666 C270.196964,238.663333 227.080238,313.32711 149.333333,448 C71.5864284,313.32711 28.4697022,238.663333 19.9831547,224.008666 C7.25333333,202.026667 2.84217094e-14,176.537017 2.84217094e-14,149.333333 C2.84217094e-14,66.8588107 66.8588107,7.10542736e-15 149.333333,7.10542736e-15 Z M149.333333,85.3333333 C113.987109,85.3333333 85.3333333,113.987109 85.3333333,149.333333 C85.3333333,184.679557 113.987109,213.333333 149.333333,213.333333 C184.679557,213.333333 213.333333,184.679557 213.333333,149.333333 C213.333333,113.987109 184.679557,85.3333333 149.333333,85.3333333 Z"
                                        id="Combined-Shape"
                                    ></path>
                                </g>
                            </g>
                        </svg>
                        <div className="ml-2">{tower.county}</div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default TowerCardClient;
