"use client";
import { searchTowers } from "@/lib/search";
import { SearchResult } from "@/typings";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";

function HeroSearch() {
    const [query, setQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

    useEffect(() => {
        const search = async (query: string) => {
            const results = await searchTowers(query);
            setSearchResults(results);
        };
        if (query) search(query);
        if (query === "") setSearchResults([]);
    }, [query]);

    return (
        <div className="dropdown md:mt-5 max-w-[94vw]">
            <label tabIndex={0} className="shadow-lg">
                <div className="join">
                    <input
                        className="input input-bordered join-item text-base-content max-w-[calc(94vw-100px)]"
                        placeholder="Petřínská věž..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Link className="btn btn-primary join-item" href={{ pathname: "/rozhledny", query: { q: query } }}>
                        Vyhledat
                    </Link>
                </div>
            </label>
            <div
                tabIndex={0}
                className={`dropdown-content !p-0 z-[10] card card-compact w-full shadow bg-base-100 text-base-content mt-1 ${
                    searchResults?.length == 0 && "hidden"
                }`}
            >
                <div className="!px-0 !py-2 !gap-0 card-body">
                    {searchResults.map((elm: SearchResult) => (
                        <Link key={elm.id} href={`/${elm.type}/${elm.name_nospaces}`} className="rounded-md px-4 py-2 hover:bg-base-200">
                            <div className="flex gap-3">
                                <div className="relative w-16 h-24 min-w-[80px] rounded-md overflow-hidden">
                                    <Image
                                        alt={elm.name}
                                        src={`/img/towers/${elm.id}/${elm.id}_0.jpg`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 20vw, 10vw"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-lg font-semibold">{elm.name}</h3>
                                    <p className="text-md text-slate-500">{elm.type}</p>
                                    <div className="flex gap-0 mb-2">
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
                                        <p className="text-md text-slate-500">{`${elm.county}, ${elm.province}`}</p>
                                    </div>
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
