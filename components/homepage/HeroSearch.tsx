"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { searchTowers } from "@/actions/towers/tower.search";
import { Tower } from "@/types/Tower";

const useDebouncedValue = (inputValue, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(inputValue);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(inputValue);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [inputValue, delay]);

    return debouncedValue;
};

function HeroSearch() {
    const [query, setQuery] = useState<string>("");
    const debouncedQuery = useDebouncedValue(query, 500);
    const [searchResults, setSearchResults] = useState<Tower[]>([]);

    useEffect(() => {
        const search = async (query: string) => {
            const { towers } = await searchTowers({ q: query });
            setSearchResults(towers);
        };
        if (debouncedQuery === "") {
            setSearchResults([]);
        } else {
            search(debouncedQuery);
        }
    }, [debouncedQuery]);

    return (
        <div className="dropdown w-full max-w-3xl">
            <form action="/rozhledny" role="search">
                <label htmlFor="homepage-search" className="sr-only">
                    Vyhledat rozhlednu
                </label>
                <div className="join w-full">
                    <input
                        id="homepage-search"
                        name="query"
                        type="search"
                        autoComplete="off"
                        className="input input-bordered join-item h-12 w-full rounded-l-full border-base-300 bg-base-100 text-base-content shadow-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset md:h-13"
                        placeholder="Najít rozhlednu..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary join-item h-12 rounded-r-full px-6 text-base focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-100 md:h-13 md:text-lg"
                    >
                        Vyhledat
                    </button>
                </div>
            </form>
            <div
                tabIndex={0}
                className={`dropdown-content z-10 mt-3 w-full overflow-hidden rounded-[1.5rem] border border-base-300/70 bg-base-100/96 text-base-content shadow-[0_30px_70px_-28px_rgba(15,23,42,0.45)] backdrop-blur ${
                    searchResults?.length == 0 && "hidden"
                }`}
            >
                <div className="border-b border-base-300/60 px-5 py-3 text-sm font-medium text-base-content/55">
                    Nejbližší výsledky
                </div>
                <div className="max-h-[26rem] overflow-y-auto px-2 py-2">
                    {searchResults.map((elm) => (
                        <Link
                            key={elm.id}
                            href={`/${elm.type}/${elm.nameID}`}
                            className="flex items-start gap-4 rounded-[1.1rem] px-3 py-3 transition-colors hover:bg-base-200/80 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                        >
                            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-base-200">
                                <Image
                                    alt={elm.name}
                                    src={elm.mainPhotoUrl}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-lg font-semibold leading-tight text-base-content">
                                        {elm.name}
                                    </h3>
                                    <span className="rounded-full bg-base-200 px-2.5 py-1 text-xs font-medium uppercase tracking-[0.14em] text-base-content/55">
                                        {elm.type}
                                    </span>
                                </div>
                                <div className="mt-3 flex items-center gap-2 text-sm text-base-content/60">
                                    <svg
                                        viewBox="0 0 512 512"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 shrink-0"
                                    >
                                        <g
                                            id="Page-1"
                                            stroke="none"
                                            strokeWidth="1"
                                            fill="none"
                                            fillRule="evenodd"
                                        >
                                            <g
                                                id="location-outline"
                                                fill="currentColor"
                                                transform="translate(106.666667, 42.666667)"
                                            >
                                                <path
                                                    d="M149.333333,7.10542736e-15 C231.807856,7.10542736e-15 298.666667,66.8588107 298.666667,149.333333 C298.666667,176.537017 291.413333,202.026667 278.683512,224.008666 C270.196964,238.663333 227.080238,313.32711 149.333333,448 C71.5864284,313.32711 28.4697022,238.663333 19.9831547,224.008666 C7.25333333,202.026667 2.84217094e-14,176.537017 2.84217094e-14,149.333333 C2.84217094e-14,66.8588107 66.8588107,7.10542736e-15 149.333333,7.10542736e-15 Z M149.333333,85.3333333 C113.987109,85.3333333 85.3333333,113.987109 85.3333333,149.333333 C85.3333333,184.679557 113.987109,213.333333 149.333333,213.333333 C184.679557,213.333333 213.333333,184.679557 213.333333,149.333333 C213.333333,113.987109 184.679557,85.3333333 149.333333,85.3333333 Z"
                                                    id="Combined-Shape"
                                                ></path>
                                            </g>
                                        </g>
                                    </svg>
                                    <p className="truncate">{`${elm.county}, ${elm.province}`}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HeroSearch;
