"use client";

import { getDistance } from "geolib";

import { getTowerTypeName } from "@/constants/towerType";
import { Tower } from "@/types/Tower";
import { formatDistance } from "@/utils/geo";
import { formatTowerPlaceLabels } from "@/utils/geography";
import { getOpeningHoursStateAndShortText } from "@/utils/openingHours";

import TowerCardBase from "../shared/TowerCardBase";

function TowerCardClient({
    tower,
    priority = false,
    avg,
    count,
    photoUrl,
    userLocation,
}: {
    tower: Tower;
    priority?: boolean;
    avg: number;
    count: number;
    photoUrl: string;
    userLocation: { latitude: number; longitude: number } | null;
}) {
    const [state, openingHoursText] = getOpeningHoursStateAndShortText(tower.openingHours);
    const locationDistance = userLocation ? getDistance(userLocation, tower.gps, 100) : null;
    const { placeLabel, regionLabel } = formatTowerPlaceLabels(tower);

    return (
        <TowerCardBase
            href={`/${tower.type || "rozhledna"}/${tower.nameID}`}
            scroll
            title={tower.name}
            aliases={tower.aliases}
            photoUrl={photoUrl}
            typeLabel={getTowerTypeName(tower.type)}
            placeLabel={placeLabel}
            regionLabel={regionLabel}
            priority={priority}
            openingHoursLabel={openingHoursText || undefined}
            openingHoursState={state}
            ratingLabel={count ? avg.toFixed(1) : "Bez recenzí"}
            ratingCount={count}
            distanceLabel={locationDistance !== null ? formatDistance(locationDistance) : null}
            titleAs="h3"
            cardClassName="mx-auto w-full max-w-76 sm:max-w-none min-[437px]:w-36 sm:w-40 md:w-44 lg:w-56"
            overlayClassName="p-3 md:p-4"
            titleClassName="text-lg sm:text-xl md:text-2xl"
            contentClassName="p-3 md:p-4"
        />
    );
}

export default TowerCardClient;
