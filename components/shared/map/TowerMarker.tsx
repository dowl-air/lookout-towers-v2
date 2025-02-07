import { defaultIcon, favouriteIcon, visitedIcon } from "@/components/shared/map/icons";
import MapTowerCard from "@/components/shared/map/MapTowerCard";
import { Tower } from "@/types/Tower";
import { Marker, Popup } from "react-leaflet";

const TowerMarker = ({ tower, isFavourite, isVisited }: { tower: Tower; isFavourite?: boolean; isVisited?: boolean }) => {
    const icon = isVisited ? visitedIcon : isFavourite ? favouriteIcon : defaultIcon;

    return (
        <Marker key={tower.id} position={[tower.gps.latitude, tower.gps.longitude]} icon={icon} title={tower.name}>
            <Popup closeButton={false}>
                <MapTowerCard tower={tower} isFavourite={isFavourite} isVisited={isVisited} />
            </Popup>
        </Marker>
    );
};

export default TowerMarker;
