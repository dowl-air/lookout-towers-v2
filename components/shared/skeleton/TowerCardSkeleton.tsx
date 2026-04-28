const TowerCardSkeleton = () => {
    return (
        <div className="w-full overflow-hidden rounded-[1.75rem] border border-base-300/70 bg-base-100 shadow-lg shadow-black/5">
            <figure className="skeleton aspect-4/5 w-full" />
            <div className="flex flex-col gap-3 p-4">
                <div className="flex flex-wrap gap-2">
                    <div className="skeleton h-8 w-28 rounded-full" />
                    <div className="skeleton h-8 w-20 rounded-full" />
                </div>

                <div className="space-y-2">
                    <div className="skeleton h-5 w-3/4" />
                    <div className="skeleton h-3 w-1/2" />
                </div>

                <div className="flex items-center justify-between gap-3">
                    <div className="skeleton h-4 w-24" />
                    <div className="skeleton h-8 w-18 rounded-full" />
                </div>
            </div>
        </div>
    );
};

export default TowerCardSkeleton;
