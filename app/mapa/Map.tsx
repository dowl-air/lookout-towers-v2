"use client";
import React, { useEffect, useRef } from "react";
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
            const { load } = await import("wpify-mapy-cz");
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
                        pin: "/img/marker.png",
                        pointer: false,
                        card: {
                            header: `<a href="/${tower.type}/${tower.nameID}" target="_blank" class="link">${tower.name}</a>`,
                        },
                        click: () =>
                            setTimeout(() => {
                                document.querySelectorAll(".card-body").forEach((elm) => elm.remove());
                            }, 1),
                    };
                });
                mapycz.addDefaultControls();
                mapycz.addMarkers(markers);
            });
        };
        initMap().then(() => document.querySelectorAll("card-body").forEach((elm) => elm.remove()));
    }, [lat, long, name, towers]);

    return <div className="flex flex-grow mx-auto bg-secondary rounded-xl overflow-hidden [&.card-body]:hidden touch-none" ref={mapElementRef}></div>;
}

export default Map;
