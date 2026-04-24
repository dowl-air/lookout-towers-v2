export default function ImageSliderSkeleton() {
    return (
        <div className="flex items-center justify-center gap-4 mt-5 max-w-7xl mx-auto overflow-hidden px-4 md:px-0">
            {[...Array(7)].map((item, index) => (
                <div
                    key={index}
                    className="card card-compact w-full max-w-[19rem] min-w-[16rem] mx-auto overflow-hidden rounded-2xl bg-base-100 shadow-lg transition-transform duration-200 cursor-pointer hover:scale-105 lg:min-w-60"
                >
                    <figure className="skeleton h-56 min-[437px]:h-52 sm:h-60 md:h-72" />
                    <div className="card-body gap-2 px-3! py-3! md:px-3! md:py-3!">
                        <div className="skeleton h-5 w-full" />
                        <div className="skeleton h-5 w-2/3" />
                        <div className="mt-1 flex items-center gap-2">
                            <div className="skeleton h-5 w-24" />
                            <div className="skeleton h-4 w-8" />
                        </div>
                        <div className="mt-1 flex flex-col gap-2 min-[437px]:flex-row min-[437px]:items-center min-[437px]:justify-between">
                            <svg
                                viewBox="0 0 512 512"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5"
                            >
                                <g
                                    id="Page-1"
                                    stroke="none"
                                    strokeWidth="1"
                                    fill="none"
                                    fillRule="evenodd"
                                >
                                    <g
                                        id="location-outline"
                                        fill="currentColor"
                                        transform="translate(106.666667, 42.666667)"
                                    >
                                        <path
                                            d="M149.333333,7.10542736e-15 C231.807856,7.10542736e-15 298.666667,66.8588107 298.666667,149.333333 C298.666667,176.537017 291.413333,202.026667 278.683512,224.008666 C270.196964,238.663333 227.080238,313.32711 149.333333,448 C71.5864284,313.32711 28.4697022,238.663333 19.9831547,224.008666 C7.25333333,202.026667 2.84217094e-14,176.537017 2.84217094e-14,149.333333 C2.84217094e-14,66.8588107 66.8588107,7.10542736e-15 149.333333,7.10542736e-15 Z M149.333333,85.3333333 C113.987109,85.3333333 85.3333333,113.987109 85.3333333,149.333333 C85.3333333,184.679557 113.987109,213.333333 149.333333,213.333333 C184.679557,213.333333 213.333333,184.679557 213.333333,149.333333 C213.333333,113.987109 184.679557,85.3333333 149.333333,85.3333333 Z"
                                            id="Combined-Shape"
                                        ></path>
                                    </g>
                                </g>
                            </svg>
                            <div className="skeleton h-4 w-24" />
                            <div className="skeleton h-4 w-16" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
