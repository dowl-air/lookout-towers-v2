import { getTowerTypeName } from "@/constants/towerType";
import { getTowerRatingAndCount } from "@/data/tower/towers";
import { Tower } from "@/types/Tower";
import { getOpeningHoursStateAndShortText } from "@/utils/openingHours";

import TowerCardBase from "./TowerCardBase";

const TowerCard = async ({ tower, priority = false }: { tower: Tower; priority?: boolean }) => {
    const { avg, count } = await getTowerRatingAndCount(tower.id);
    const [state, openingHoursText] = getOpeningHoursStateAndShortText(tower.openingHours);
    return (
        <TowerCardBase
            href={`/${tower.type}/${tower.nameID}`}
            title={tower.name}
            aliases={tower.aliases}
            photoUrl={tower.mainPhotoUrl}
            typeLabel={getTowerTypeName(tower.type)}
            placeLabel={tower.county ?? tower.province ?? tower.country}
            regionLabel={tower.province ?? tower.country}
            priority={priority}
            openingHoursLabel={openingHoursText || undefined}
            openingHoursState={state}
            ratingLabel={count ? avg.toFixed(1) : "Bez recenzí"}
            ratingCount={count}
            distanceGps={tower.gps}
        />
    );
};

export default TowerCard;
