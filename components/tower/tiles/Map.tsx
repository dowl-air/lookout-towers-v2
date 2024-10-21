"use client";
import React, { useEffect, useRef } from "react";

type MapProps = {
    lat: number;
    long: number;
    name: string;
};

function Map({ lat, long, name }: MapProps) {
    const mapElementRef = useRef(null);
    useEffect(() => {
        const initMap = async () => {
            const { load } = await import("wpify-mapy-cz");
            const config = {
                element: mapElementRef.current,
                center: { latitude: lat, longitude: long },
                zoom: 14,
                mapType: "DEF_TURIST",
            };
            load(config, (mapycz) => {
                const options = {
                    latitude: lat,
                    longitude: long,
                    id: "marker-1",
                    layer: "markers",
                    title: name,
                    pin: "/img/marker.png",
                };
                mapycz.addDefaultControls();
                mapycz.addMarker(options);
            });
        };
        initMap();
    }, [lat, long, name]);

    return <div className="mx-auto w-full max-w-7xl bg-secondary h-[32rem] xl:rounded-xl overflow-hidden touch-none" ref={mapElementRef}></div>;
}

export default Map;
