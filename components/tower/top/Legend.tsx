import { OpeningHoursForbiddenType, OpeningHoursType, OpeningHours } from "@/types/OpeningHours";
import { Tower } from "@/types/Tower";

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const generareHeight = (height: number, type: string): string => {
    if (height < 0) return `${type} má neznámou výšku`;
    if (height === 0) return `${type} se nachází na úrovni terénu`;
    if (height === 1) return `${type} je vysoká 1 metr`;
    if (height <= 4) return `${type} je vysoká ${height} metry`;
    return `${type} je vysoká ${height} metrů`;
};

const generateStairs = (stairs: number): string => {
    if (stairs < 0) return "a má neznámý počet schodů.";
    if (stairs === 0) return "a nemá žádné schody.";
    if (stairs === 1) return "a má jen 1 schod.";
    if (stairs <= 4) return `a má jen ${stairs} schody.`;
    return `a má ${stairs} schodů.`;
};

const generateElevation = (elevation: number): string => {
    if (elevation < 0) return "Má neznámou nadmořskou výšku";
    return `Nachází se v nadmořské výšce ${elevation} metrů`;
};

const generateHeading = (openingHours: OpeningHours): string => {
    if (openingHours.type === OpeningHoursType.NonStop) return `je volně přístupná.`;
    if (openingHours.type === OpeningHoursType.Forbidden) {
        if (openingHours.forbiddenType === OpeningHoursForbiddenType.Reconstruction) return `je právě v rekonstrukci.`;
        if (openingHours.forbiddenType === OpeningHoursForbiddenType.Temporary) return `je dočasně uzavřena.`;
        if (openingHours.forbiddenType === OpeningHoursForbiddenType.Banned) return `je nepřístupná.`;
        return `je označena jako zaniklá.`;
    }
    if (openingHours.type === OpeningHoursType.Occasionally) return `je přístupná pouze příležitostně.`;
    if (openingHours.type === OpeningHoursType.EveryMonth) return `je otevřena celoročně dle otevírací doby.`;
    if (openingHours.type === OpeningHoursType.SomeMonths) return `je otevřena některé měsíce dle otevírací doby.`;
    return "má neznámou otevírací dobu.";
};

function Legend({ tower }: { tower: Tower }) {
    const height = tower.height ? tower.height : -1;
    const stairs = tower.stairs ? tower.stairs : -1;
    const elevation = tower.elevation ? tower.elevation : 0;
    const typeCap = tower.type ? capitalizeFirstLetter(tower.type) : "Rozhledna";

    return (
        <legend className="text-center lg:text-left">{`${generareHeight(height, typeCap)} ${generateStairs(stairs)} ${generateElevation(
            elevation
        )} a ${generateHeading(tower.openingHours)}`}</legend>
    );
}

export default Legend;
