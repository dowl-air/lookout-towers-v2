"use client";

import { Marker } from "react-leaflet";
import { locationIcon } from "./icons";

interface LocationMarkerProps {
    position: { latitude: number; longitude: number };
}

const LocationMarker = ({ position }: LocationMarkerProps) => {
    return <Marker position={[position.latitude, position.longitude]} icon={locationIcon} zIndexOffset={1000}></Marker>;
};

export default LocationMarker;
