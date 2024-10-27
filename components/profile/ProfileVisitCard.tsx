import Image from "next/image";
import Link from "next/link";

import { Visit, Tower, Rating } from "@/typings";
import { extractDomain } from "@/utils/extractDomain";
import ThemedRating from "../shared/ThemedRating";

function ProfileVisitCard({ visit, tower, rating }: { visit: Visit; tower: Tower | undefined; rating: Rating | undefined }) {
    return (
        <>
            <div className="card w-[300px] bg-base-100 shadow-xl h-full">
                <Link href={`/${tower.type}/${tower?.nameID}`}>
                    {tower?.mainPhotoUrl ? (
                        <figure className="relative w-full h-48">
                            <Image
                                alt="Tower Photo"
                                src={tower.mainPhotoUrl}
                                fill={true}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
                                className="object-cover"
                                unoptimized
                            />
                        </figure>
                    ) : (
                        <figure className="bg-gray-300 w-full h-48 flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                            </svg>
                        </figure>
                    )}
                </Link>

                <div className="card-body">
                    <Link href={`/${tower.type}/${tower?.nameID}`}>
                        <h2 className="card-title items-start">
                            {tower?.name || "Unknown Tower"}
                            <button onClick={() => {}} className="btn btn-primary btn-sm ml-auto" title="Upravit návštěvu">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m18 5-2.414-2.414A2 2 0 0 0 14.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2" />
                                    <path d="M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
                                    <path d="M8 18h1" />
                                </svg>
                            </button>
                        </h2>
                    </Link>
                    <time className="text-sm opacity-50">
                        {new Date(visit.date).toLocaleTimeString("cs", {
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZone: "Europe/Prague",
                        })}
                    </time>
                    <p className="text-sm">{visit.text}</p>
                    <div className="flex flex-col gap-2 mt-2">
                        {visit.urls &&
                            visit.urls.map((url, index) => (
                                <div key={index} className="flex items-center gap-1.5">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-primary"
                                    >
                                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                    </svg>
                                    <a key={index} href={url} target="_blank" className="text-base text-primary underline">
                                        {extractDomain(url)}
                                    </a>
                                </div>
                            ))}
                    </div>
                    {rating && (
                        <>
                            <hr className="my-2" />
                            <p className="opacity-50">Moje hodnocení</p>
                            <ThemedRating size={25} value={rating.rating} />
                            <p className="text-sm">{rating.text}</p>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default ProfileVisitCard;
