import TowerCardSkeleton from "@/components/shared/skeleton/TowerCardSkeleton";

const ResultsSkeleton = () => {
    return (
        <div className="grid grid-cols-2 min-[500px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-4 md:gap-y-6 gap-x-3 md:gap-x-4 min-h-[70vh]">
            {[...Array(20)].map((_, idx) => (
                <TowerCardSkeleton key={idx} />
            ))}
        </div>
    );
};

export default ResultsSkeleton;
