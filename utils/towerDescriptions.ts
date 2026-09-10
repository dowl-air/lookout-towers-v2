import { getTowerTypeName } from "@/constants/towerType";
import { OpeningHoursForbiddenType, OpeningHoursType } from "@/types/OpeningHours";
import type { Tower } from "@/types/Tower";

type TowerDescriptionSource = Pick<
    Tower,
    "elevation" | "height" | "history" | "openingHours" | "stairs" | "texts" | "type"
>;

type TowerFactDescriptionSource = Pick<
    Tower,
    "material" | "name" | "observationDecksCount" | "opened" | "type"
>;

const MATERIAL_PHRASE_MAP: Record<string, string> = {
    beton: "z betonu",
    dřevo: "ze dřeva",
    kámen: "z kamene",
    kov: "z kovu",
    netradiční: "z netradičních materiálů",
    zdivo: "ze zdiva",
};

const capitalizeFirstLetter = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const joinCzechList = (items: string[]) => {
    if (items.length === 0) return "";
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} a ${items[1]}`;

    return `${items.slice(0, -1).join(", ")} a ${items[items.length - 1]}`;
};

const formatObservationDecks = (count?: number) => {
    if (!count) return null;
    if (count === 1) return "Má 1 vyhlídkovou plošinu";
    if (count >= 2 && count <= 4) return `Má ${count} vyhlídkové plošiny`;

    return `Má ${count} vyhlídkových plošin`;
};

const formatHeight = (height: number, type: string) => {
    if (height < 0) return `${type} má neznámou výšku`;
    if (height === 0) return `${type} se nachází na úrovni terénu`;
    if (height === 1) return `${type} je vysoká 1 metr`;
    if (height <= 4) return `${type} je vysoká ${height} metry`;
    return `${type} je vysoká ${height} metrů`;
};

const formatStairs = (stairs: number) => {
    if (stairs < 0) return "a má neznámý počet schodů.";
    if (stairs === 0) return "a nemá žádné schody.";
    if (stairs === 1) return "a má jen 1 schod.";
    if (stairs <= 4) return `a má jen ${stairs} schody.`;
    return `a má ${stairs} schodů.`;
};

const formatElevation = (elevation: number) => {
    if (elevation < 0) return "Má neznámou nadmořskou výšku";
    return `Nachází se v nadmořské výšce ${elevation} metrů`;
};

const formatAccess = (tower: Pick<Tower, "openingHours">) => {
    if (tower.openingHours.type === OpeningHoursType.NonStop) return "je volně přístupná.";
    if (tower.openingHours.type === OpeningHoursType.Forbidden) {
        if (tower.openingHours.forbiddenType === OpeningHoursForbiddenType.Reconstruction) {
            return "je právě v rekonstrukci.";
        }
        if (tower.openingHours.forbiddenType === OpeningHoursForbiddenType.Temporary) {
            return "je dočasně uzavřena.";
        }
        if (tower.openingHours.forbiddenType === OpeningHoursForbiddenType.Banned) {
            return "je nepřístupná.";
        }
        return "je označena jako zaniklá.";
    }
    if (tower.openingHours.type === OpeningHoursType.Occasionally) {
        return "je přístupná pouze příležitostně.";
    }
    if (tower.openingHours.type === OpeningHoursType.EveryMonth) {
        return "je otevřena celoročně dle otevírací doby.";
    }
    if (tower.openingHours.type === OpeningHoursType.SomeMonths) {
        return "je otevřena některé měsíce dle otevírací doby.";
    }
    return "má neznámou otevírací dobu.";
};

export const getTowerHeroDescription = (tower: Pick<Tower, "texts">) =>
    tower.texts?.heroDescription?.trim() || undefined;

export const getTowerFactDescription = (
    tower: TowerFactDescriptionSource,
    openingHoursText?: string
) => {
    const openedYear = tower.opened ? new Date(tower.opened).getFullYear() : null;
    const materialText = tower.material.length
        ? joinCzechList(
              tower.material.map((material) => MATERIAL_PHRASE_MAP[material] ?? `z ${material}`)
          )
        : null;
    const introduction = [
        `${tower.name} je ${getTowerTypeName(tower.type)}`,
        openedYear ? `postavená roku ${openedYear}` : null,
        materialText,
    ]
        .filter(Boolean)
        .join(" ");
    const sentences = [
        introduction,
        formatObservationDecks(tower.observationDecksCount),
        openingHoursText,
    ].filter((sentence): sentence is string => Boolean(sentence));

    return sentences.map((sentence) => `${sentence.replace(/[.!?]+$/, "")}.`).join(" ");
};

export const getTowerSeoFallbackDescription = (
    tower: Pick<Tower, "elevation" | "height" | "openingHours" | "stairs" | "type">
) => {
    const type = capitalizeFirstLetter(getTowerTypeName(tower.type)) || "Rozhledna";
    const height = tower.height ?? -1;
    const stairs = tower.stairs ?? -1;
    const elevation = tower.elevation ?? -1;

    return `${formatHeight(height, type)} ${formatStairs(stairs)} ${formatElevation(elevation)} a ${formatAccess(tower)}`;
};

export const getTowerSeoDescription = (tower: TowerDescriptionSource) =>
    tower.texts?.seoDescription?.trim() ||
    tower.history?.trim() ||
    getTowerHeroDescription(tower) ||
    getTowerSeoFallbackDescription(tower);
