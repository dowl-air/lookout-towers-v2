const TowerCardSkeleton = () => {
    return (
        <div className="card card-compact w-full mx-auto transition-transform duration-200 cursor-pointer hover:scale-105 ">
            <figure className="skeleton h-60 min-[437px]:h-52 sm:h-60 md:h-72" />
            <div className="card-body !px-1 !py-2 md:!py-3 md:!px-3 gap-0">
                <div className="skeleton w-full h-5" />
                <div className="mt-2 flex-row flex items-center">
                    <svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" className="w-5">
                        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <g id="location-outline" fill="currentColor" transform="translate(106.666667, 42.666667)">
                                <path d="M149.333333,7.10542736e-15 C231.807856,7.10542736e-15 298.666667,66.8588107 298.666667,149.333333 C298.666667,176.537017 291.413333,202.026667 278.683512,224.008666 C270.196964,238.663333 227.080238,313.32711 149.333333,448 C71.5864284,313.32711 28.4697022,238.663333 19.9831547,224.008666 C7.25333333,202.026667 2.84217094e-14,176.537017 2.84217094e-14,149.333333 C2.84217094e-14,66.8588107 66.8588107,7.10542736e-15 149.333333,7.10542736e-15 Z M149.333333,85.3333333 C113.987109,85.3333333 85.3333333,113.987109 85.3333333,149.333333 C85.3333333,184.679557 113.987109,213.333333 149.333333,213.333333 C184.679557,213.333333 213.333333,184.679557 213.333333,149.333333 C213.333333,113.987109 184.679557,85.3333333 149.333333,85.3333333 Z"></path>
                            </g>
                        </g>
                    </svg>
                    <div className="ml-2">
                        <div className="skeleton w-16 h-3" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TowerCardSkeleton;
