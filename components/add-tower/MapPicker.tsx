"use client";

import "leaflet/dist/leaflet.css";
import "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";
import { useEffect } from "react";

type Position = { latitude: number; longitude: number };

/* const MapEvents = ({
    setPickedPosition,
    pickedPosition,
}: {
    setPickedPosition: (position: { latitude: number; longitude: number }) => void;
    pickedPosition: { latitude: number; longitude: number };
}) => {
    const map = useMapEvents({
        click(e) {
            setPickedPosition({ latitude: e.latlng.lat, longitude: e.latlng.lng });
        },
    });

    useEffect(() => {
        if (pickedPosition) {
            map.flyTo([pickedPosition.latitude, pickedPosition.longitude], map.getZoom(), { animate: true, easeLinearity: 0.5, duration: 1 });
        }
    }, [pickedPosition]);

    return null;
}; */

const MapPicker = ({ pickedPosition, setPickedPosition }: { pickedPosition: Position; setPickedPosition: (position: Position) => void }) => {
    /* if (typeof window === "undefined")  */return null;

    /* const icon = L.icon({
        iconUrl: "/img/marker_red.png",
        shadowUrl: "/img/marker-shadow.png",
        iconSize: [23, 32],
        iconAnchor: [11, 32],
        shadowSize: [41, 41],
        shadowAnchor: [13, 41],
    });

    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true} className="w-full h-[500px] z-0">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {pickedPosition && <Marker position={[pickedPosition.latitude, pickedPosition.longitude]} icon={icon}></Marker>}
            <MapEvents setPickedPosition={setPickedPosition} pickedPosition={pickedPosition} />
        </MapContainer>
    ); */
};

export default MapPicker;
