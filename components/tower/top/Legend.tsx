import { Tower } from "@/types/Tower";
import { getOpeningHoursStateAndShortText } from "@/utils/openingHours";
import { getTowerFactDescription } from "@/utils/towerDescriptions";

function Legend({ tower, date }: { tower: Tower; date: Date }) {
    const [, openingHoursText] = getOpeningHoursStateAndShortText(tower.openingHours, date);

    return (
        <legend className="text-left">{getTowerFactDescription(tower, openingHoursText)}</legend>
    );
}

export default Legend;
