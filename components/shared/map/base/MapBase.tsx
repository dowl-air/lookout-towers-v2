"use client";

import { ReactNode } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/images/marker-shadow.png";

const MapBase = ({
    center = { lat: 49.8237572, lng: 15.6086383 },
    zoom = 8,
    children,
}: {
    center?: { lat: number; lng: number };
    zoom?: number;
    children: ReactNode;
}) => {
    return (
        <MapContainer center={[center.lat, center.lng]} zoom={zoom} scrollWheelZoom={true} className="w-full h-full z-0">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {children}
        </MapContainer>
    );
};

export default MapBase;
