import { searchTowers } from "@/actions/towers/tower.search";
import Filter from "@/components/towers/Filter";
import Pagination from "@/components/towers/Pagination";
import Results from "@/components/towers/Results";
import ResultsSkeleton from "@/components/towers/ResultsSkeleton";
import { Suspense } from "react";

const PER_PAGE = 20;

async function TowersPage(props: { searchParams?: Promise<{ query?: string; page?: number; county?: string; province?: string }> }) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || "";
    const page = searchParams?.page || 1;
    const county = searchParams?.county || "";
    const province = searchParams?.province || "";

    let filter_by = "";
    if (province) filter_by += `province:=${province}`;
    if (county) filter_by += filter_by ? ` && county:=${county}` : `county:=${county}`;

    const { towers, found } = await searchTowers({
        q: query,
        limit: PER_PAGE,
        offset: (page - 1) * PER_PAGE,
        filter_by,
    });

    const totalPages = Math.max(Math.ceil(found / PER_PAGE), 1);

    return (
        <div className="w-full max-w-7xl mx-auto mt-5 lg:mt-10 px-5">
            <article className="prose prose-sm lg:prose-base max-w-full">
                <h1 className="mb-0 md:mb-6">Rozhledny a vyhlídky</h1>
                <Filter />
            </article>
            <Pagination totalPages={totalPages} />
            <Suspense key={query} fallback={<ResultsSkeleton />}>
                <Results towers={towers} />
            </Suspense>
            {totalPages > 1 ? <Pagination totalPages={totalPages} /> : null}
        </div>
    );
}

export default TowersPage;
