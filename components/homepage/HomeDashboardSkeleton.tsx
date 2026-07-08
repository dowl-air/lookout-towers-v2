function HomeDashboardSkeleton() {
    return (
        <section className="mx-auto mt-10 w-full max-w-[1070px] px-4">
            <div className="overflow-hidden rounded-lg border border-base-300 bg-base-100 shadow-sm">
                <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-5 p-5 sm:p-7">
                        <div className="skeleton h-6 w-48" />
                        <div className="skeleton h-10 w-full max-w-md" />
                        <div className="skeleton h-4 w-full max-w-lg" />
                        <div className="skeleton h-4 w-2/3" />
                        <div className="flex flex-wrap gap-3 pt-2">
                            <div className="skeleton h-11 w-40 rounded-lg" />
                            <div className="skeleton h-11 w-32 rounded-lg" />
                        </div>
                    </div>
                    <div className="border-t border-base-300 p-5 sm:p-7 lg:border-l lg:border-t-0">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="skeleton h-24 rounded-lg" />
                            <div className="skeleton h-24 rounded-lg" />
                            <div className="skeleton h-24 rounded-lg" />
                            <div className="skeleton h-24 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HomeDashboardSkeleton;
