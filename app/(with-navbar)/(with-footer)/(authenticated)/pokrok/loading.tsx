const Loading = () => {
    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-3 py-8 xl:px-0">
            <article className="space-y-3">
                <div className="skeleton h-10 w-44" />
                <div className="skeleton h-5 w-full max-w-3xl" />
                <div className="skeleton h-5 w-5/6 max-w-2xl" />
            </article>
            <div className="flex flex-wrap gap-px overflow-hidden rounded-box shadow-sm">
                {[...Array(3)].map((_, index) => (
                    <div className="bg-base-100 p-6" key={index}>
                        <div className="skeleton h-4 w-20" />
                        <div className="mt-3 skeleton h-10 w-24" />
                        <div className="mt-2 skeleton h-4 w-28" />
                    </div>
                ))}
            </div>
            <div className="skeleton h-3 w-full rounded-full" />
            <section className="rounded-lg border border-base-300 bg-base-100 p-4 shadow-sm">
                <div className="skeleton h-5 w-36" />
                <div className="mt-4 skeleton h-9 w-56" />
                <div className="mt-4 skeleton h-3 w-full rounded-full" />
            </section>
            <div className="grid gap-5">
                {[...Array(4)].map((_, sectionIndex) => (
                    <section
                        className="rounded-lg border border-base-300 bg-base-100 p-4 shadow-sm"
                        key={sectionIndex}
                    >
                        <div className="skeleton h-6 w-44" />
                        <div className="mt-2 skeleton h-4 w-32" />
                        <div className="mt-5 flex flex-wrap gap-2">
                            {[...Array(20)].map((_, towerIndex) => (
                                <div
                                    className="skeleton size-9 rounded-sm sm:size-10"
                                    key={towerIndex}
                                />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};

export default Loading;
