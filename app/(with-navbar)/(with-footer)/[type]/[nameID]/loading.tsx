const SkeletonLine = ({ className }: { className: string }) => (
    <div className={`skeleton ${className}`} />
);

const SkeletonIcon = () => <div className="skeleton size-9 rounded-lg" />;

const PracticalInfoRowSkeleton = () => (
    <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-3 gap-y-3 p-5 md:grid-cols-[2.75rem_10rem_minmax(0,1fr)] md:items-center">
        <SkeletonIcon />
        <SkeletonLine className="h-6 w-36 self-center" />
        <div className="col-span-2 space-y-3 md:col-span-1">
            <SkeletonLine className="h-5 w-56 max-w-full" />
            <div className="rounded-lg bg-base-200/45 px-4 py-3">
                <SkeletonLine className="mb-3 h-4 w-full" />
                <SkeletonLine className="h-4 w-3/4" />
            </div>
        </div>
    </div>
);

const SummaryLineSkeleton = () => (
    <div className="flex items-center justify-between gap-4 border-b border-base-300/60 py-2 last:border-b-0">
        <SkeletonLine className="h-4 w-24" />
        <SkeletonLine className="h-4 w-28" />
    </div>
);

const Loading = () => {
    const heroTags = Array.from({ length: 7 });
    const thumbnails = Array.from({ length: 2 });
    const summaryLines = Array.from({ length: 10 });
    const ratingRows = Array.from({ length: 3 });
    const sourceRows = Array.from({ length: 3 });

    return (
        <div className="w-full px-4">
            <div className="mx-auto grid w-full max-w-[1720px] gap-4 2xl:grid-cols-[minmax(8rem,1fr)_minmax(0,80rem)_minmax(8rem,1fr)]">
                <aside
                    aria-hidden="true"
                    className="invisible mt-4 hidden h-96 self-start 2xl:sticky 2xl:top-20 2xl:block"
                />

                <div className="min-w-0">
                    <section className="mx-auto mt-4 w-full max-w-7xl overflow-hidden rounded-lg border border-base-300/70 bg-base-100 shadow-xl">
                        <div className="grid min-h-136 gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,36rem)]">
                            <div className="flex min-h-112 flex-col gap-6 p-5 sm:p-8 lg:min-h-136">
                                <SkeletonLine className="hidden h-4 w-64 sm:block" />

                                <div className="flex flex-col gap-4 lg:my-auto">
                                    <div className="space-y-3">
                                        <SkeletonLine className="h-10 w-72 max-w-full sm:h-14 sm:w-96" />
                                        <SkeletonLine className="h-5 w-52 max-w-full" />
                                    </div>

                                    <div className="flex max-h-24 flex-wrap gap-2 overflow-hidden sm:max-h-18">
                                        {heroTags.map((_tag, index) => (
                                            <SkeletonLine
                                                key={index}
                                                className="h-8 w-28 rounded-md"
                                            />
                                        ))}
                                    </div>

                                    <div className="max-w-lg space-y-3">
                                        <SkeletonLine className="h-4 w-full" />
                                        <SkeletonLine className="h-4 w-11/12" />
                                        <SkeletonLine className="h-4 w-3/4" />
                                    </div>
                                </div>

                                <div className="mt-auto flex flex-wrap gap-2">
                                    <SkeletonLine className="h-12 w-40 rounded-btn" />
                                    <SkeletonLine className="h-12 w-44 rounded-btn" />
                                    <SkeletonLine className="h-12 w-32 rounded-btn" />
                                </div>
                            </div>

                            <div className="flex min-h-120 flex-col bg-base-200/35 p-3 lg:min-h-136">
                                <SkeletonLine className="h-full min-h-80 w-full rounded-lg" />
                                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-1 sm:grid-rows-2">
                                    {thumbnails.map((_thumbnail, index) => (
                                        <SkeletonLine
                                            key={index}
                                            className="h-20 w-full rounded-lg sm:h-24"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="mx-auto mb-6 mt-8 flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-6 sm:mt-10">
                        <section className="w-full" aria-label="Načítání praktických informací">
                            <div className="mb-4 space-y-2">
                                <SkeletonLine className="h-8 w-64" />
                                <SkeletonLine className="h-4 w-96 max-w-full" />
                            </div>

                            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
                                <div className="rounded-lg border border-base-300/70 bg-base-100 shadow-sm">
                                    <div className="divide-y divide-base-300/70">
                                        <PracticalInfoRowSkeleton />
                                        <PracticalInfoRowSkeleton />
                                        <PracticalInfoRowSkeleton />
                                    </div>
                                </div>

                                <aside
                                    className="rounded-lg border border-base-300/70 bg-base-100 shadow-sm"
                                    aria-label="Načítání souhrnu údajů"
                                >
                                    <div className="border-b border-base-300/70 bg-base-200/45 px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <SkeletonIcon />
                                            <div className="space-y-2">
                                                <SkeletonLine className="h-5 w-32" />
                                                <SkeletonLine className="h-3 w-40" />
                                            </div>
                                        </div>
                                    </div>
                                    <dl className="px-5 py-3">
                                        {summaryLines.map((_line, index) => (
                                            <SummaryLineSkeleton key={index} />
                                        ))}
                                    </dl>
                                    <div className="flex flex-wrap gap-2 border-t border-base-300/70 px-5 py-4">
                                        <SkeletonLine className="h-9 w-40 rounded-lg" />
                                        <SkeletonLine className="h-9 w-44 rounded-lg" />
                                    </div>
                                    <div className="border-t border-base-300/70 px-5 py-4">
                                        <SkeletonLine className="h-12 w-full rounded-btn" />
                                    </div>
                                </aside>
                            </div>
                        </section>

                        <section className="card w-full bg-[rgba(255,255,255,0.05)] shadow-xl">
                            <div className="card-body gap-4">
                                <SkeletonLine className="h-7 w-48" />
                                <div className="space-y-3">
                                    <SkeletonLine className="h-4 w-full" />
                                    <SkeletonLine className="h-4 w-11/12" />
                                    <SkeletonLine className="h-4 w-4/5" />
                                </div>
                            </div>
                        </section>

                        <section className="card flex w-full flex-col justify-center gap-6 bg-[rgba(255,255,255,0.05)] px-6 py-8 shadow-xl">
                            <div className="flex w-full items-center justify-between gap-3">
                                <SkeletonLine className="h-7 w-40" />
                                <SkeletonLine className="h-10 w-36 rounded-btn" />
                            </div>
                            <div className="flex flex-col gap-6 md:flex-row md:gap-8">
                                <div className="flex w-full flex-col gap-4">
                                    {ratingRows.map((_row, index) => (
                                        <div
                                            key={index}
                                            className="rounded-lg border border-base-300/70 bg-base-100/60 p-4"
                                        >
                                            <SkeletonLine className="mb-3 h-5 w-44" />
                                            <SkeletonLine className="h-4 w-full" />
                                        </div>
                                    ))}
                                </div>
                                <div className="divider w-full md:divider-horizontal md:w-4" />
                                <div className="w-full space-y-3 md:max-w-xs">
                                    <SkeletonLine className="h-6 w-32" />
                                    <SkeletonLine className="h-24 w-full rounded-lg" />
                                    <SkeletonLine className="h-4 w-3/4" />
                                </div>
                            </div>
                        </section>

                        <section
                            id="mapa"
                            className="card mx-auto flex w-full max-w-7xl scroll-mt-24 flex-col shadow-xl md:flex-row"
                        >
                            <SkeletonLine className="h-96 w-full rounded-xl rounded-b-none md:rounded-b-xl md:rounded-r-none sm:h-120 lg:h-136" />
                            <div className="card-body flex flex-col justify-center gap-4 px-6 py-5 md:max-w-sm">
                                <SkeletonLine className="my-2 h-7 w-24" />
                                <div className="space-y-3 rounded-lg border border-base-300/70 bg-base-200/35 p-3">
                                    <SkeletonLine className="h-5 w-full" />
                                    <SkeletonLine className="h-10 w-full rounded-btn" />
                                </div>
                                <SkeletonLine className="h-12 w-full rounded-btn" />
                                <SkeletonLine className="h-12 w-full rounded-btn" />
                                <SkeletonLine className="h-12 w-full rounded-btn" />
                            </div>
                        </section>

                        <section className="card card-compact w-full bg-[rgba(255,255,255,0.05)] shadow-xl sm:card-normal">
                            <div className="card-body">
                                <SkeletonLine className="h-7 w-44" />
                                <div className="mt-4 flex flex-col gap-3">
                                    {sourceRows.map((_row, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <SkeletonLine className="h-4 w-6" />
                                            <SkeletonLine className="size-7 rounded-full" />
                                            <SkeletonLine className="h-5 w-64 max-w-[70vw]" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section className="w-full rounded-lg border border-base-300/70 bg-base-100/60 p-5 shadow-sm">
                            <SkeletonLine className="mb-4 h-7 w-48" />
                            <div className="space-y-3">
                                <SkeletonLine className="h-5 w-full" />
                                <SkeletonLine className="h-5 w-10/12" />
                            </div>
                        </section>

                        <section className="w-full border-t border-base-300/70 py-10 sm:py-14">
                            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
                                <SkeletonLine className="size-16 rounded-full sm:size-20" />
                                <div className="space-y-2">
                                    <SkeletonLine className="mx-auto h-8 w-56" />
                                    <SkeletonLine className="mx-auto h-4 w-136 max-w-[80vw]" />
                                    <SkeletonLine className="mx-auto h-4 w-96 max-w-[70vw]" />
                                </div>
                                <SkeletonLine className="h-12 w-44 rounded-btn" />
                            </div>
                        </section>
                    </div>
                </div>

                <aside
                    aria-hidden="true"
                    className="invisible mt-4 hidden h-96 self-start 2xl:sticky 2xl:top-20 2xl:block"
                />
            </div>
        </div>
    );
};

export default Loading;
