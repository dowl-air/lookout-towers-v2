import { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import { searchTowers } from "@/actions/towers/tower.search";
import LocationPermissionPrompt from "@/components/shared/LocationPermissionPrompt";
import Filter from "@/components/towers/Filter";
import Pagination from "@/components/towers/Pagination";
import Results from "@/components/towers/Results";
import ResultsSkeleton from "@/components/towers/ResultsSkeleton";
import { TowersSearchParams } from "@/types/TowersSearchParams";
import { TowersFilter } from "@/utils/TowersFilter";

export const metadata: Metadata = {
    title: "Rozhledny",
};

const PER_PAGE = 20;

const parsePage = (page?: number | string): number => {
    const parsedPage = Number(page || 1);
    return Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
};

const parseLocation = (location?: string): { lat: number; lng: number } | null => {
    if (!location) return null;

    const [latitude, longitude] = location.split(",").map(Number);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

    return { lat: latitude, lng: longitude };
};

const getSort = (sort: string, location: { lat: number; lng: number } | null): string => {
    switch (sort) {
        case "distance":
            return location ? `gps(${location.lat}, ${location.lng}):asc` : "name:asc";
        case "name_desc":
            return "name:desc";
        case "height_desc":
            return "height:desc";
        case "view_height_desc":
            return "viewHeight:desc";
        case "stairs_desc":
            return "stairs:desc";
        case "elevation_desc":
            return "elevation:desc";
        case "opened_desc":
            return "opened:desc";
        case "opened_asc":
            return "opened:asc";
        default:
            return "name:asc";
    }
};

async function TowersPage(props: { searchParams?: Promise<TowersSearchParams> }) {
    await connection();

    const searchParams = await props.searchParams;
    const query = searchParams?.query || "";
    const page = parsePage(searchParams?.page);
    const sort = searchParams?.sort || "";
    const location = parseLocation(searchParams?.location);

    const filter = new TowersFilter(searchParams);
    const sort_by = getSort(sort, location);

    const { towers, found } = await searchTowers({
        q: query,
        limit: PER_PAGE,
        offset: (page - 1) * PER_PAGE,
        filter_by: filter.getFilterString(),
        sort_by,
    });

    const totalPages = Math.max(Math.ceil(found / PER_PAGE), 1);

    return (
        <div className="w-full max-w-7xl mx-auto mt-5 lg:mt-10 px-5">
            <article className="prose prose-sm lg:prose-base max-w-full">
                <h1 className="mb-0 md:mb-6">Rozhledny a vyhlídky</h1>
            </article>
            <Suspense
                fallback={
                    <div className="card card-compact md:card-normal w-full shadow-xl min-h-28" />
                }
            >
                <Filter searchParams={searchParams || {}} />
            </Suspense>
            <LocationPermissionPrompt className="mt-5" />
            <Suspense fallback={null}>
                <Pagination
                    totalPages={totalPages}
                    currentPage={page}
                    pathname="/rozhledny"
                    searchParams={searchParams || {}}
                />
            </Suspense>
            <Suspense key={query} fallback={<ResultsSkeleton />}>
                <Results towers={towers} />
            </Suspense>
            {totalPages > 1 ? (
                <Suspense fallback={null}>
                    <Pagination
                        totalPages={totalPages}
                        currentPage={page}
                        pathname="/rozhledny"
                        searchParams={searchParams || {}}
                    />
                </Suspense>
            ) : null}
        </div>
    );
}

export default TowersPage;
