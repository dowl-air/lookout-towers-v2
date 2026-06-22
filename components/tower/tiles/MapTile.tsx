import { MapPin } from "lucide-react";
import Image from "next/image";

import { TowerMap } from "@/components/shared/map/TowerMap";
import CopyGpsButton from "@/components/tower/tiles/CopyGpsButton";
import { CONCURRENCE_LOGOS } from "@/constants/concurrenceLogos";
import { Tower } from "@/types/Tower";

const MapTile = ({ tower }: { tower: Tower }) => {
    const { latitude, longitude } = tower.gps;
    const coordinates = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

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
        <div
            id="mapa"
            className="card mx-auto flex w-full max-w-7xl scroll-mt-24 flex-col shadow-xl md:flex-row"
        >
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

            <div className="card-body flex flex-col justify-center gap-4 px-6 py-5">
                <h4 className="card-title text-base sm:text-lg md:text-xl text-nowrap my-2">
                    Poloha
                </h4>

                <div className="mb-3 space-y-3 rounded-lg border border-base-300/70 bg-base-200/35 p-3">
                    <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-base-content/70">
                        <MapPin className="size-4 text-primary" />
                        <span>GPS</span>
                        <span className="min-w-0 whitespace-nowrap font-mono text-sm font-bold text-base-content">
                            {coordinates}
                        </span>
                    </div>
                    <CopyGpsButton coordinates={coordinates} className="w-full justify-center" />
                </div>

                <a
                    href={directionUrls.mapyCz}
                    className="btn btn-outline btn-sm w-full justify-start whitespace-nowrap sm:btn-md"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div className="avatar">
                        <div className="w-6 rounded-full">
                            <Image
                                src={CONCURRENCE_LOGOS["mapy.com"]}
                                alt=""
                                className="object-contain!"
                                loading="lazy"
                                width={24}
                                height={24}
                            />
                        </div>
                    </div>
                    Navigovat pomocí Mapy.com
                </a>

                <a
                    href={directionUrls.googleMaps}
                    className="btn btn-outline btn-sm w-full justify-start whitespace-nowrap sm:btn-md"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div className="avatar">
                        <div className="w-6 rounded-full">
                            <Image
                                src={CONCURRENCE_LOGOS["maps.google.com"]}
                                alt=""
                                className="object-contain!"
                                loading="lazy"
                                width={24}
                                height={24}
                            />
                        </div>
                    </div>
                    Navigovat pomocí Google Maps
                </a>

                <a
                    href={directionUrls.waze}
                    className="btn btn-outline btn-sm w-full justify-start whitespace-nowrap sm:btn-md"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div className="avatar">
                        <div className="w-6 rounded-full">
                            <Image
                                src={CONCURRENCE_LOGOS["waze.com"]}
                                alt=""
                                className="object-cover!"
                                loading="lazy"
                                width={24}
                                height={24}
                            />
                        </div>
                    </div>
                    Navigovat pomocí Waze
                </a>
            </div>
        </div>
    );
};

export default MapTile;
