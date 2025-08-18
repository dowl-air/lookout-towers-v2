"use client";

import { Tower } from "@/types/Tower";
import { Marker } from "react-leaflet";
import { defaultIcon } from "@/components/shared/map/base/icons";
import MapBase from "@/components/shared/map/base/MapBase";
import { Bike, Car, Milestone } from "lucide-react";
import { CONCURRENCE_LOGOS } from "@/constants/concurrenceLogos";

const TowerMap = ({ tower }: { tower: Tower }) => {
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
            <div className="h-96 sm:h-[30rem] lg:h-[34rem] rounded-xl rounded-b-none md:rounded-b-xl md:rounded-r-none overflow-hidden touch-none w-full">
                <MapBase center={{ lat: latitude, lng: longitude }} zoom={12}>
                    <Marker position={{ lat: latitude, lng: longitude }} icon={defaultIcon} title={tower.name} />
                </MapBase>
            </div>

            <div className="flex gap-3 justify-center flex-col px-6 py-3 card-body">
                <h4 className="card-title text-base sm:text-lg md:text-xl text-nowrap my-2">Vyhledat trasu</h4>

                <div className="flex gap-2 items-center">
                    <div className="avatar">
                        <div className="w-7 rounded-full">
                            <img src={CONCURRENCE_LOGOS["mapy.com"]} className="object-contain!" loading="lazy" />
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
                            <img src={CONCURRENCE_LOGOS["maps.google.com"]} className="object-contain!" loading="lazy" />
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
                            <img src={CONCURRENCE_LOGOS["waze.com"]} className="object-cover!" loading="lazy" />
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

export default TowerMap;
