"use client";
import React, { useEffect, useRef, useState } from "react";
import { Tower } from "@/typings";
import ReactDOMServer from "react-dom/server";
import Image from "next/image";
import { useSession } from "next-auth/react";

type MapProps = {
    lat: number;
    long: number;
    name: string;
    towers: Tower[];
};

function Map({ lat, long, name, towers }: MapProps) {
    const mapElementRef = useRef(null);
    const { data: session, status } = useSession();

    useEffect(() => {
        const getFavourites = async (user_id: string): Promise<string[]> => {
            const result = await fetch(
                "/api/favourites/user?" +
                    new URLSearchParams({
                        // @ts-ignore
                        user_id: user_id,
                    }).toString()
            ).then((res) => res.json());
            if (result.status == 200) return result.message as string[];
            return [];
        };
        const initMap = async () => {
            const { load, MapyCz } = await import("wpify-mapy-cz");
            // @ts-ignore
            const favourites = session?.user.id ? await getFavourites(session?.user.id) : [];
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
                        pin: favourites.includes(tower.id) ? "/img/marker_yellow.png" : "/img/marker_red.png",
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
        if (status !== "loading") initMap();
    }, [lat, long, name, towers, status]);

    return (
        <div
            id="big_map"
            className="flex flex-grow mx-auto bg-secondary rounded-xl overflow-hidden [&.card-body]:hidden touch-none"
            ref={mapElementRef}
        ></div>
    );
}

export default Map;
