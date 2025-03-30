import { defaultIcon, favouriteIcon, visitedIcon } from "@/components/shared/map/base/icons";
import MapTowerCard from "@/components/shared/map/base/MapTowerCard";
import { OpeningHoursType } from "@/types/OpeningHours";
import { Tower } from "@/types/Tower";
import { Marker, Popup } from "react-leaflet";

const TowerMarker = ({ tower, isFavourite, isVisited }: { tower: Tower; isFavourite?: boolean; isVisited?: boolean }) => {
    const icon = isVisited ? visitedIcon : isFavourite ? favouriteIcon : defaultIcon;
    const isGoneOrClosed = tower.openingHours.type === OpeningHoursType.Forbidden || tower.openingHours.type === OpeningHoursType.Occasionally;

    return (
        <Marker key={tower.id} position={[tower.gps.latitude, tower.gps.longitude]} icon={icon} title={tower.name} opacity={isGoneOrClosed ? 0.5 : 1}>
            <Popup closeButton={false}>
                <MapTowerCard tower={tower} isFavourite={isFavourite} isVisited={isVisited} />
            </Popup>
        </Marker>
    );
};

export default TowerMarker;
