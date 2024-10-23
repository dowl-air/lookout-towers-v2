import { Tower } from "@/typings";
import { OpeningHoursForbiddenType, OpeningHoursType } from "@/utils/constants";

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const generateHeading = (openingHours: OpeningHours): string => {
    if (openingHours.type === OpeningHoursType.Unknown) return " má neznámou otevírací dobu.";
    if (openingHours.type === OpeningHoursType.NonStop) return ` je volně přístupná.`;
    if (openingHours.type === OpeningHoursType.Forbidden) {
        if (openingHours.forbidden_type === OpeningHoursForbiddenType.Reconstruction) return ` je právě v rekonstrukci.`;
        if (openingHours.forbidden_type === OpeningHoursForbiddenType.Temporary) return ` je dočasně uzavřena.`;
        return ` je označena jako zaniklá.`;
    }
    if (openingHours.type === OpeningHoursType.Occasionally) return ` je přístupná pouze příležitostně.`;
    if (openingHours.months?.length === 0) return ` je otevřena celoročně (viz níže).`;
    return " otevírací doba je uvedena níže.";
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
