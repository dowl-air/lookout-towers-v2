export default function ImageSliderSkeleton() {
    return (
        <div className="flex items-center justify-center gap-4 mt-5 max-w-7xl mx-auto overflow-hidden px-4 md:px-0">
            {[...Array(7)].map((item, index) => (
                <div
                    key={index}
                    className="mx-auto w-full max-w-76 min-w-64 overflow-hidden rounded-[1.75rem] border border-base-300/70 bg-base-100 shadow-lg shadow-black/5 lg:min-w-60"
                >
                    <figure className="skeleton aspect-4/5 w-full" />
                    <div className="flex flex-col gap-3 p-3 md:p-4">
                        <div className="flex flex-wrap gap-2">
                            <div className="skeleton h-8 w-24 rounded-full" />
                            <div className="skeleton h-8 w-18 rounded-full" />
                        </div>

                        <div className="space-y-2">
                            <div className="skeleton h-5 w-3/4" />
                            <div className="skeleton h-4 w-1/2" />
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <div className="skeleton h-4 w-20" />
                            <div className="skeleton h-8 w-18 rounded-full" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
