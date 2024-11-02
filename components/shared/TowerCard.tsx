import { getTowerRatingAndCount } from "@/actions/towers/towers.action";
import { Tower } from "@/typings";
import Image from "next/image";
import Link from "next/link";
import ThemedRating from "./ThemedRating";

const TowerCard = async ({ tower, priority = false }: { tower: Tower; priority: boolean }) => {
    const { avg, count } = await getTowerRatingAndCount(tower.id);
    return (
        <Link href={`/${tower.type || "rozhledna"}/${tower.nameID}`} scroll>
            <div className="card card-compact w-36 sm:w-40 md:w-44 lg:w-56 mx-auto transition-transform duration-200 cursor-pointer hover:scale-105 ">
                <figure className="object-cover inline-block relative h-52 sm:h-60 md:h-72">
                    {/* <Image
                        src={tower?.mainPhotoUrl || `/img/towers/${id}/${id}_0.jpg`} //todo i wont use this
                        alt={tower.name}
                        fill
                        priority={priority}
                        className="object-cover block"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        unoptimized
                    /> */}
                    {tower.opened ? (
                        <div className="badge absolute bottom-2 left-2 text-white bg-transparent border-white">
                            {new Date(tower.opened).getFullYear()}
                        </div>
                    ) : null}
                </figure>
                <div className="card-body !py-2 md:!py-3 gap-0">
                    <h2 className="card-title whitespace-nowrap overflow-hidden overflow-ellipsis block text-base sm:text-lg md:text-xl">
                        {tower.name}
                    </h2>
                    <div className="flex flex-row items-center">
                        <ThemedRating size={20} value={avg} />
                        <div className="flex lg:gap-1 text-md text-gray-400 ml-2">{count}x</div>
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
};

export default TowerCard;
