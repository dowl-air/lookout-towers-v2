"use client";
import { Tower } from "@/typings";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import ReactDOMServer from "react-dom/server";

function DynamicMap({
    lat,
    long,
    towers,
    type,
    visits,
    favs,
}: {
    lat: number;
    long: number;
    towers: Tower[];
    type: string;
    visits: string[];
    favs: string[];
}) {
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
                        pin: visits.includes(tower.id)
                            ? "/img/marker_green.png"
                            : favs.includes(tower.id)
                            ? "/img/marker_yellow.png"
                            : "/img/marker_red.png",
                        pointer: false,
                        card: {
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
    }, [lat, long, towers, favs, visits]);

    return (
        <div
            id="big_map"
            className="flex flex-grow mx-auto bg-secondary rounded-xl overflow-hidden [&.card-body]:hidden touch-none"
            ref={mapElementRef}
        ></div>
    );
}

export default DynamicMap;
