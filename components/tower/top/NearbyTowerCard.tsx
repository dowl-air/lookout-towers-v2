import { getDistance } from "geolib";

import TowerCardBase from "@/components/shared/TowerCardBase";
import { getTowerTypeName } from "@/constants/towerType";
import { getTowerRatingAndCount } from "@/data/tower/towers";
import { Tower } from "@/types/Tower";
import { formatDistance } from "@/utils/geo";
import { formatTowerPlaceLabels } from "@/utils/geography";
import { getOpeningHoursStateAndShortText } from "@/utils/openingHours";

const NearbyTowerCard = async ({
    sourceGps,
    tower,
}: {
    sourceGps: Tower["gps"];
    tower: Tower;
}) => {
    const { avg, count } = await getTowerRatingAndCount(tower.id);
    const [state, openingHoursText] = getOpeningHoursStateAndShortText(tower.openingHours);
    const { placeLabel, regionLabel } = formatTowerPlaceLabels(tower);
    const distance = getDistance(sourceGps, tower.gps, 100);

    return (
        <TowerCardBase
            href={`/${tower.type}/${tower.nameID}`}
            title={tower.name}
            aliases={tower.aliases}
            photoUrl={tower.mainPhotoUrl}
            typeLabel={getTowerTypeName(tower.type)}
            placeLabel={placeLabel}
            regionLabel={regionLabel}
            openingHoursLabel={openingHoursText || undefined}
            openingHoursState={state}
            ratingLabel={count ? avg.toFixed(1) : "Bez recenzí"}
            ratingCount={count}
            distanceLabel={formatDistance(distance)}
            titleAs="h3"
            cardClassName="h-full rounded-3xl shadow-md shadow-black/5 hover:shadow-xl hover:shadow-black/10"
            imageClassName="object-top"
            overlayClassName="p-3"
            titleClassName="text-lg"
            aliasesClassName="text-xs"
            contentClassName="gap-2 p-3"
            footerClassName="text-xs"
        />
    );
};

export default NearbyTowerCard;
