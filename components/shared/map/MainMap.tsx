"use client";

import { Tower } from "@/types/Tower";
import { Visit } from "@/types/Visit";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/images/marker-shadow.png";
import TowerMarker from "@/components/shared/map/TowerMarker";

const MainMap = ({ towers, visits, favourites }: { towers: Tower[]; visits: Visit[]; favourites: string[] }) => {
    return (
        <MapContainer center={[49.8237572, 15.6086383]} zoom={8} scrollWheelZoom={true} className="w-full h-full z-0">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {towers.map((tower) => {
                const isVisited = visits.some((visit) => visit.tower_id === tower.id);
                const isFavourite = favourites.includes(tower.id);

                return <TowerMarker key={tower.id} tower={tower} isFavourite={isFavourite} isVisited={isVisited} />;
            })}
        </MapContainer>
    );
};

export default MainMap;
