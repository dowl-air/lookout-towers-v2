"use client";
import { useEffect, useRef } from "react";
import ReactDOMServer from "react-dom/server";
import Image from "next/image";

import { Tower } from "@/typings";

type MapProps = {
    lat: number;
    long: number;
    name: string;
    towers: Tower[];
};

function Map({ lat, long, name, towers }: MapProps) {
    const mapElementRef = useRef(null);

    useEffect(() => {
        const initMap = async () => {
            const { load, MapyCz } = await import("wpify-mapy-cz");
            // @ts-ignore
            const config = {
                element: mapElementRef.current,
                center: { latitude: lat, longitude: long },
                zoom: 8,
                mapType: "DEF_TURIST",
            };
            load(config, (mapycz) => {
                const markers = towers.map((tower) => {
                    return {
                        latitude: tower.gps.latitude,
                        longitude: tower.gps.longitude,
                        id: tower.nameID,
                        layer: "towers",
                        title: tower.name,
                        pin: tower.isVisited ? "/img/marker_green.png" : tower.isFavourite ? "/img/marker_yellow.png" : "/img/marker_red.png",
                        pointer: false,
                        card: {
                            /* header: `<a href="/${tower.type}/${tower.nameID}" target="_blank" class="link">${tower.name}</a>`, */
                            header: ReactDOMServer.renderToString(
                                <a href={`/${tower.type}/${tower.nameID}`}>
                                    <div className="prose">
                                        <h3 className="text-center">{tower.name}</h3>
                                    </div>
                                </a>
                            ),
                            footer: ReactDOMServer.renderToString(
                                <a href={`/${tower.type}/${tower.nameID}`}>
                                    <div className="h-52 w-52">
                                        <Image
                                            src={tower.mainPhotoUrl}
                                            alt={tower.name}
                                            height={208}
                                            width={208}
                                            className="block object-cover !w-full !h-full rounded-md"
                                            unoptimized
                                        />
                                    </div>
                                </a>
                            ),
                        },
                    };
                });
                mapycz.addDefaultControls();
                mapycz.addMarkers(markers);
            });
        };
        initMap();
    }, [lat, long, name, towers]);

    return (
        <div
            id="big_map"
            className="flex flex-grow mx-auto bg-secondary rounded-xl overflow-hidden [&.card-body]:hidden touch-none"
            ref={mapElementRef}
        ></div>
    );
}

export default Map;
