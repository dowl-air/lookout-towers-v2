import { Bike, Car, Milestone } from "lucide-react";
import Image from "next/image";

import { TowerMap } from "@/components/shared/map/TowerMap";
import { CONCURRENCE_LOGOS } from "@/constants/concurrenceLogos";
import { Tower } from "@/types/Tower";

const MapTile = ({ tower }: { tower: Tower }) => {
    const { latitude, longitude } = tower.gps;

    // Generate direction URLs for different map services
    const getDirectionUrls = () => {
        return {
            googleMaps: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
            mapyCz: `https://mapy.com/fnc/v1/route?mapset=outdoor&end=${longitude},${latitude}`,
            waze: `https://waze.com/ul?ll=${latitude}%2C${longitude}&navigate=yes`,
        };
    };

    const directionUrls = getDirectionUrls();

    return (
        <div className="card shadow-xl mx-auto w-full max-w-7xl flex flex-col md:flex-row">
            <div className="h-96 sm:h-120 lg:h-136 rounded-xl rounded-b-none md:rounded-b-xl md:rounded-r-none overflow-hidden touch-none w-full">
                {/* <MapBase center={{ lat: latitude, lng: longitude }} zoom={12}>
                    <Marker
                        position={{ lat: latitude, lng: longitude }}
                        icon={defaultIcon}
                        title={tower.name}
                    />
                </MapBase> */}
                <TowerMap tower={tower} />
            </div>

            <div className="flex gap-3 justify-center flex-col px-6 py-3 card-body">
                <h4 className="card-title text-base sm:text-lg md:text-xl text-nowrap my-2">
                    Vyhledat trasu
                </h4>

                <div className="flex gap-2 items-center">
                    <div className="avatar">
                        <div className="w-7 rounded-full">
                            <Image
                                src={CONCURRENCE_LOGOS["mapy.com"]}
                                alt="mapy.com logo"
                                className="object-contain!"
                                loading="lazy"
                                width={28}
                                height={28}
                            />
                        </div>
                    </div>
                    <p>Mapy.com</p>
                </div>

                <div className="flex gap-2">
                    <a
                        href={directionUrls.mapyCz + "&routeType=car_fast_traffic"}
                        className="btn whitespace-nowrap btn-sm sm:btn-md"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Car className="w-4 h-4" />
                        Autem
                    </a>
                    <a
                        href={directionUrls.mapyCz + "&routeType=bike_mountain"}
                        className="btn whitespace-nowrap btn-sm sm:btn-md"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Bike className="w-4 h-4" />
                        Na kole
                    </a>
                    <a
                        href={directionUrls.mapyCz + "&routeType=foot_fast"}
                        className="btn whitespace-nowrap btn-sm sm:btn-md"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Milestone className="w-4 h-4" />
                        Pěšky
                    </a>
                </div>

                <div className="flex gap-2 items-center mt-2">
                    <div className="avatar">
                        <div className="w-7 rounded-full">
                            <Image
                                src={CONCURRENCE_LOGOS["maps.google.com"]}
                                alt="Google Maps logo"
                                className="object-contain!"
                                loading="lazy"
                                width={28}
                                height={28}
                            />
                        </div>
                    </div>
                    <p>Google Maps</p>
                </div>

                <a
                    href={directionUrls.googleMaps}
                    className="btn whitespace-nowrap max-w-[86px] sm:max-w-[100px] btn-sm sm:btn-md"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Car className="w-4 h-4" />
                    Autem
                </a>

                <div className="flex gap-2 items-center mt-2">
                    <div className="avatar">
                        <div className="w-7 rounded-full">
                            <Image
                                src={CONCURRENCE_LOGOS["waze.com"]}
                                alt="Waze logo"
                                className="object-cover!"
                                loading="lazy"
                                width={28}
                                height={28}
                            />
                        </div>
                    </div>
                    <p>Waze</p>
                </div>

                <a
                    href={directionUrls.waze}
                    className="btn whitespace-nowrap max-w-[86px] sm:max-w-[100px] btn-sm sm:btn-md"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Car className="w-4 h-4" />
                    Autem
                </a>
            </div>
        </div>
    );
};

export default MapTile;
