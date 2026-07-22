import { Tower } from "@/types/Tower";
import { getTowerFallbackDescription } from "@/utils/towerDescriptions";

function Legend({ tower }: { tower: Tower }) {
    return <legend className="text-left">{getTowerFallbackDescription(tower)}</legend>;
}

export default Legend;
