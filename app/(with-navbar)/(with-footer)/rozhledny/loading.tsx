import Filter from "@/components/towers/Filter";
import Pagination from "@/components/towers/Pagination";
import ResultsSkeleton from "@/components/towers/ResultsSkeleton";

const Loading = () => {
    const totalPages = 1;

    return (
        <div className="w-full max-w-7xl mx-auto mt-5 lg:mt-10 px-5">
            <article className="prose prose-sm lg:prose-base max-w-full">
                <h1 className="mb-0 md:mb-6">Rozhledny a vyhlídky</h1>
                <Filter />
            </article>
            <Pagination totalPages={totalPages} />
            <ResultsSkeleton />
        </div>
    );
};

export default Loading;
