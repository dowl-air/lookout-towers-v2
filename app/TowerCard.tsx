import React from "react";
import { Tower } from "@/typings";
import Link from "next/link";

type PageProps = {
    tower: Tower;
};

function TowerCard({ tower }: PageProps) {
    return (
        <Link href={`/${tower.type || "rozhledna"}/${tower.nameID}`}>
            <div className="card card-compact w-56 transition-transform duration-200 cursor-pointer hover:scale-105 ">
                <figure className="object-cover inline-block relative h-72">
                    <div className="badge absolute bottom-2 left-2 text-white bg-transparent border-white">{tower.height} m</div>
                    <img src={tower.mainPhotoUrl} alt="tower" className="object-cover w-full h-full block"></img>
                </figure>
                {"getFullYear" in tower.opened &&
                    tower.opened.getFullYear() in [new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2] && (
                        <div className="badge badge-accent absolute top-2 left-2 font-bold">NOVÁ</div>
                    )}
                <div className="card-body gap-0">
                    <h2 className="card-title whitespace-nowrap overflow-hidden overflow-ellipsis block">{tower.name}</h2>
                    <div className="flex-row flex items-center">
                        <div className="rating rating-sm">
                            <input
                                type="radio"
                                name="rating-4"
                                className={`mask mask-star-2 ${(tower.rating?.avg || 0) > 0 && "bg-secondary"}`}
                                readOnly
                            />
                            <input
                                type="radio"
                                name="rating-4"
                                className={`mask mask-star-2 ${(tower.rating?.avg || 0) > 1 && "bg-secondary"}`}
                                readOnly
                            />
                            <input
                                type="radio"
                                name="rating-4"
                                className={`mask mask-star-2 ${(tower.rating?.avg || 0) > 2 && "bg-secondary"}`}
                                readOnly
                            />
                            <input
                                type="radio"
                                name="rating-4"
                                className={`mask mask-star-2 ${(tower.rating?.avg || 0) > 3 && "bg-secondary"}`}
                                readOnly
                            />
                            <input
                                type="radio"
                                name="rating-4"
                                className={`mask mask-star-2 ${(tower.rating?.avg || 0) > 4 && "bg-secondary"}`}
                                readOnly
                            />
                        </div>
                        <div className="text-md text-gray-400 ml-2">{`${tower.rating?.count || 0} hodnocení`}</div>
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

export default TowerCard;
