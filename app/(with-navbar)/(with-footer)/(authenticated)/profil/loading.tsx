const Loading = () => {
    return (
        <div className="mx-auto my-8 flex max-w-[calc(min(99dvw,80rem))] flex-col gap-5 px-3 xl:px-0">
            <article className="space-y-3 px-3">
                <div className="skeleton h-10 w-44" />
                <div className="skeleton h-5 w-full max-w-lg" />
            </article>
            <div className="grid w-full gap-5 lg:grid-cols-[17rem_minmax(0,1fr)]">
                <aside className="h-[420px] rounded-box bg-base-100 p-6 shadow-xl">
                    <div className="mx-auto skeleton size-20 rounded-full" />
                    <div className="mx-auto mt-5 skeleton h-8 w-36" />
                    <div className="mt-8 space-y-5">
                        {[...Array(4)].map((_, index) => (
                            <div className="skeleton h-14 w-full" key={index} />
                        ))}
                    </div>
                </aside>
                <div className="skeleton h-[360px] w-full sm:h-[560px] lg:h-[687px]" />
            </div>
        </div>
    );
};

export default Loading;
