import { Tower } from "@/typings";
import { OpeningHoursForbiddenType, OpeningHoursType, OpeningHours } from "@/types/OpeningHours";

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const generateHeading = (openingHours: OpeningHours): string => {
    if (openingHours.type === OpeningHoursType.NonStop) return ` je volně přístupná.`;
    if (openingHours.type === OpeningHoursType.Forbidden) {
        if (openingHours.forbiddenType === OpeningHoursForbiddenType.Reconstruction) return ` je právě v rekonstrukci.`;
        if (openingHours.forbiddenType === OpeningHoursForbiddenType.Temporary) return ` je dočasně uzavřena.`;
        if (openingHours.forbiddenType === OpeningHoursForbiddenType.Banned) return ` je nepřístupná.`;
        return ` je označena jako zaniklá.`;
    }
    if (openingHours.type === OpeningHoursType.Occasionally) return ` je přístupná pouze příležitostně.`;
    if (openingHours.type === OpeningHoursType.EveryMonth) return ` je otevřena celoročně dle otevírací doby.`;
    if (openingHours.type === OpeningHoursType.SomeMonths) return ` je otevřena některé měsíce dle otevírací doby.`;
    return " má neznámou otevírací dobu.";
};

function Legend({ tower }: { tower: Tower }) {
    return (
        <legend className="text-center lg:text-left">{`${capitalizeFirstLetter(tower.type)} je vysoká ${
            tower.height === -1 ? "neznámo" : tower.height
        } metrů a vede na ni ${tower.stairs === -1 ? "neznámo" : "přesně " + tower.stairs} schodů. Nachází se v nadmořské výšce ${
            tower.elevation
        } metrů a ${generateHeading(tower.openingHours)}`}</legend>
    );
}

export default Legend;
