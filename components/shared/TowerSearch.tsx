"use client";

import { MapPin, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { searchTowers } from "@/actions/towers/tower.search";
import TowerAliases from "@/components/shared/TowerAliases";
import { getTowerTypeName } from "@/constants/towerType";
import { Tower } from "@/types/Tower";
import { cn } from "@/utils/cn";
import { formatCountyName, formatProvinceName } from "@/utils/geography";

type TowerSearchVariant = "hero" | "navbar";

type TowerSearchProps = {
    id: string;
    variant?: TowerSearchVariant;
};

const useDebouncedValue = <T,>(inputValue: T, delay: number) => {
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

function TowerSearch({ id, variant = "hero" }: TowerSearchProps) {
    const isNavbarVariant = variant === "navbar";
    const [isExpanded, setIsExpanded] = useState(!isNavbarVariant);
    const [query, setQuery] = useState<string>("");
    const debouncedQuery = useDebouncedValue(query, 500);
    const [searchResults, setSearchResults] = useState<Tower[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

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

    useEffect(() => {
        if (!isExpanded || !isNavbarVariant) {
            return;
        }

        const focusTimeout = window.setTimeout(() => inputRef.current?.focus(), 100);

        return () => window.clearTimeout(focusTimeout);
    }, [isExpanded, isNavbarVariant]);

    const collapseSearch = () => {
        if (!isNavbarVariant) {
            return;
        }

        setIsExpanded(false);
        setQuery("");
        setSearchResults([]);
    };

    const handleSearchButtonClick = () => {
        if (!isExpanded) {
            setIsExpanded(true);
        } else {
            inputRef.current?.focus();
        }
    };

    const handleSearchButtonPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
        if (!isExpanded) {
            event.preventDefault();
        }
    };

    const hasSearchResults = searchResults.length > 0;

    return (
        <div
            className={cn(
                "dropdown",
                isNavbarVariant ? "relative flex h-8 items-center" : "w-full max-w-3xl"
            )}
        >
            <form
                action="/rozhledny"
                role="search"
                className={cn(isNavbarVariant ? "flex h-8 items-center" : undefined)}
                onKeyDown={(event) => {
                    if (event.key === "Escape") {
                        collapseSearch();
                    }
                }}
            >
                <label htmlFor={id} className="sr-only">
                    Vyhledat rozhlednu
                </label>
                {isNavbarVariant ? (
                    <>
                        <button
                            type="button"
                            aria-label={isExpanded ? "Vyhledat rozhlednu" : "Otevřít vyhledávání"}
                            className="flex h-8 w-13 shrink-0 cursor-pointer items-center justify-center rounded-full bg-base-200/80 text-base-content transition-colors hover:bg-base-300/70 focus:bg-base-300/70 active:bg-base-300/70 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-100"
                            onClick={handleSearchButtonClick}
                            onPointerDown={handleSearchButtonPointerDown}
                        >
                            <Search size={19} />
                        </button>
                        <div
                            className={cn(
                                "fixed left-1/2 top-15 z-20 flex w-[min(28rem,calc(100vw-2rem))] origin-top items-center rounded-full border border-base-300/70 bg-base-100/96 p-1 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.6)] backdrop-blur transition-[opacity,transform,visibility] duration-[250ms] ease-out focus-within:border-primary/60",
                                isExpanded
                                    ? "visible -translate-x-1/2 translate-y-0 scale-100 opacity-100"
                                    : "invisible -translate-x-1/2 -translate-y-2 scale-[0.98] opacity-0"
                            )}
                        >
                            <Search size={18} className="ml-3 shrink-0 text-base-content/45" />
                            {isExpanded && (
                                <input
                                    ref={inputRef}
                                    id={id}
                                    name="query"
                                    type="text"
                                    autoComplete="off"
                                    className="input h-10 min-h-10 min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-base-content shadow-none outline-hidden placeholder:text-base-content/45 focus:outline-hidden focus-visible:outline-hidden"
                                    placeholder="Najít rozhlednu..."
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                />
                            )}
                            <button
                                type="button"
                                aria-label="Zavřít vyhledávání"
                                className="btn btn-ghost btn-circle h-9 min-h-9 w-9 shrink-0 rounded-full focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-100"
                                onClick={collapseSearch}
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="join w-full">
                        <input
                            ref={inputRef}
                            id={id}
                            name="query"
                            type="search"
                            autoComplete="off"
                            className="input input-bordered join-item h-12 w-full rounded-l-full border-base-300 bg-base-100 text-base-content shadow-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset md:h-13"
                            placeholder="Najít rozhlednu..."
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                        <button
                            type="submit"
                            className="btn btn-primary join-item h-12 rounded-r-full px-6 text-base focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-100 md:h-13 md:text-lg"
                        >
                            Vyhledat
                        </button>
                    </div>
                )}
            </form>
            {hasSearchResults && isExpanded && (
                <div
                    tabIndex={0}
                    className={cn(
                        "dropdown-content z-10 overflow-hidden border border-base-300/70 bg-base-100/96 text-base-content shadow-[0_30px_70px_-28px_rgba(15,23,42,0.45)] backdrop-blur",
                        isNavbarVariant
                            ? "fixed left-1/2 top-32 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl"
                            : "mt-3 w-full rounded-3xl"
                    )}
                >
                    <div className="border-b border-base-300/60 px-5 py-3 text-sm font-medium text-base-content/55">
                        Nejbližší výsledky
                    </div>
                    <div className="max-h-104 overflow-y-auto px-2 py-2">
                        {searchResults.map((tower) => (
                            <Link
                                key={tower.id}
                                href={`/${tower.type}/${tower.nameID}`}
                                className="flex items-start gap-4 rounded-[1.1rem] px-3 py-3 transition-colors hover:bg-base-200/80 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                                onClick={collapseSearch}
                            >
                                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-base-200">
                                    <Image
                                        alt={tower.name}
                                        src={tower.mainPhotoUrl}
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-lg font-semibold leading-tight text-base-content">
                                            {tower.name}
                                        </h3>
                                        <span className="rounded-full bg-base-200 px-2.5 py-1 text-xs font-medium uppercase tracking-[0.14em] text-base-content/55">
                                            {getTowerTypeName(tower.type)}
                                        </span>
                                    </div>
                                    <TowerAliases
                                        aliases={tower.aliases}
                                        className="mt-1 text-left"
                                    />
                                    <div className="mt-3 flex items-center gap-2 text-sm text-base-content/60">
                                        <MapPin size={16} className="shrink-0" />
                                        <p className="truncate">{`${formatCountyName(tower.county)}, ${formatProvinceName(tower.country, tower.province)}`}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TowerSearch;
