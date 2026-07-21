import { MapPin } from "lucide-react";
import Image from "next/image";

import { TowerMap } from "@/components/shared/map/TowerMap";
import CopyGpsButton from "@/components/tower/tiles/CopyGpsButton";
import MapDistance from "@/components/tower/tiles/MapDistance";
import { CONCURRENCE_LOGOS } from "@/constants/concurrenceLogos";
import { Tower } from "@/types/Tower";

const MapTile = ({ tower, nearbyTowers = [] }: { nearbyTowers?: Tower[]; tower: Tower }) => {
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
                <TowerMap tower={tower} nearbyTowers={nearbyTowers} />
            </div>

            <div className="card-body flex flex-col justify-center gap-4 px-6 py-5">
                <h4 className="card-title text-base sm:text-lg md:text-xl text-nowrap my-2">
                    Poloha
                </h4>
                <MapDistance latitude={latitude} longitude={longitude} />

                <div className="mb-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-base-content/70">
                        <MapPin className="size-4 text-primary" />
                        <span>GPS</span>
                    </div>
                    <div className="font-mono text-sm font-bold text-base-content">{coordinates}</div>
                    <CopyGpsButton coordinates={coordinates} className="justify-center" />
                </div>

                <div>
                    <div className="mb-2 text-sm font-semibold text-base-content/70">Navigovat</div>
                    <div className="flex gap-2">
                        {[
                            {
                                alt: "Navigovat pomocí Mapy.com",
                                href: directionUrls.mapyCz,
                                logo: CONCURRENCE_LOGOS["mapy.com"],
                            },
                            {
                                alt: "Navigovat pomocí Google Maps",
                                href: directionUrls.googleMaps,
                                logo: CONCURRENCE_LOGOS["maps.google.com"],
                            },
                            {
                                alt: "Navigovat pomocí Waze",
                                href: directionUrls.waze,
                                logo: CONCURRENCE_LOGOS["waze.com"],
                            },
                        ].map(({ alt, href, logo }) => (
                            <a
                                key={href}
                                href={href}
                                aria-label={alt}
                                title={alt}
                                className="btn btn-outline btn-square btn-sm sm:btn-md"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Image
                                    src={logo}
                                    alt=""
                                    aria-hidden="true"
                                    className="size-6 shrink-0 object-contain!"
                                    loading="lazy"
                                    width={24}
                                    height={24}
                                />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapTile;
