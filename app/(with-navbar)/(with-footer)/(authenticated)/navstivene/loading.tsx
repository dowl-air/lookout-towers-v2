const Loading = () => {
    return (
        <div className="m-auto my-8 flex max-w-[calc(min(99dvw,80rem))] flex-col gap-5 px-3 xl:px-0">
            <article className="space-y-3 px-3">
                <div className="skeleton h-10 w-80 max-w-full" />
                <div className="skeleton h-5 w-full max-w-3xl" />
                <div className="skeleton h-5 w-4/5 max-w-2xl" />
            </article>
            <div className="flex flex-wrap overflow-hidden rounded-box shadow-sm">
                {[...Array(4)].map((_, index) => (
                    <div className="w-44 bg-base-100 p-6" key={index}>
                        <div className="skeleton h-4 w-24" />
                        <div className="mt-3 skeleton h-10 w-20" />
                        <div className="mt-2 skeleton h-4 w-28" />
                    </div>
                ))}
            </div>
            <div className="mx-auto skeleton h-10 w-40" />
            <div className="flex flex-col gap-4">
                {[...Array(8)].map((_, index) => (
                    <div
                        className="flex min-h-32 gap-4 rounded-box bg-base-100 p-4 shadow-sm"
                        key={index}
                    >
                        <div className="skeleton h-24 w-20 shrink-0" />
                        <div className="flex flex-1 flex-col gap-3 py-1">
                            <div className="skeleton h-6 w-2/5" />
                            <div className="skeleton h-4 w-1/4" />
                            <div className="skeleton h-4 w-3/4" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Loading;
