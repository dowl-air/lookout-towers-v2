import { Tower, Visit } from "@/typings";
import Image from "next/image";

function VisitsTimeline({ visits, towers }: { visits: Visit[]; towers: Tower[] }) {
    return (
        <ol className="relative border-l w-full">
            {visits
                .sort((a, b) => {
                    return b.date.getTime() - a.date.getTime();
                })
                .map((visit, idx) => (
                    <li className="mb-10 ml-6 max-w-[calc(90vw-1.5rem)]" key={idx}>
                        <span className="absolute flex items-center justify-center w-6 h-6 bg-base-200 rounded-full -left-3 ring-8 ring-base-100">
                            <svg
                                className="w-2.5 h-2.5 text-secondary"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                            </svg>
                        </span>
                        <h3 className="flex items-center mb-1 text-xl font-semibold text-base-content">
                            {towers.find((t) => t.id === visit.tower_id)?.name}
                        </h3>
                        <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                            {`Navštíveno dne ${visit.date.toLocaleDateString()}`}
                        </time>
                        <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400 w-full">{visit.text}</p>
                        {towers.find((t) => t.id === visit.tower_id)?.mainPhotoUrl ? (
                            <div className="relative w-80 h-48">
                                <Image
                                    alt={"rozhledna"}
                                    src={towers.find((t) => t.id === visit.tower_id)?.mainPhotoUrl!}
                                    fill={true}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-contain"
                                    unoptimized
                                />
                            </div>
                        ) : (
                            <div role="status" className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 md:flex md:items-center">
                                <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                                    <svg
                                        className="w-10 h-10 text-gray-200 dark:text-gray-600"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 20 18"
                                    >
                                        <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                    </svg>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
        </ol>
    );
}

export default VisitsTimeline;
