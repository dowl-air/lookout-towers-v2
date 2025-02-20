import { searchTowers } from "@/actions/towers/tower.search";
import Filter from "@/components/towers/Filter";
import Pagination from "@/components/towers/Pagination";
import Results from "@/components/towers/Results";
import ResultsSkeleton from "@/components/towers/ResultsSkeleton";
import { TowersSearchParams } from "@/types/TowersSearchParams";
import { TowersFilter } from "@/utils/TowersFilter";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Rozhledny",
};

const PER_PAGE = 20;

async function TowersPage(props: { searchParams?: Promise<TowersSearchParams> }) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || "";
    const page = searchParams?.page || 1;
    const sort = searchParams?.sort || "";

    let location = null;
    if (searchParams?.location) {
        const [latitude, longitude] = searchParams.location.split(",");
        location = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
    }

    const filter = new TowersFilter(searchParams);

    let sort_by = "name:asc";
    if (sort === "distance" && location) sort_by = `gps(${location.lat}, ${location.lng}):asc`;

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
            <Filter />
            <Pagination totalPages={totalPages} />
            <Suspense key={query} fallback={<ResultsSkeleton />}>
                <Results towers={towers} />
            </Suspense>
            {totalPages > 1 ? <Pagination totalPages={totalPages} /> : null}
        </div>
    );
}

export default TowersPage;
