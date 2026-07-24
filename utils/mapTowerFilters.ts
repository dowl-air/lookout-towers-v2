import {
    OpeningHoursForbiddenType,
    OpeningHoursType,
    type OpeningHours,
} from "@/types/OpeningHours";

type MapTowerFilterTarget = {
    isFavourite: boolean;
    isVisited: boolean;
    openingHours: OpeningHours;
};

export type MapTowerFilters = {
    includeGone: boolean;
    onlyFavourites: boolean;
    onlyVisited: boolean;
};

export type MapTowerPersonalStatuses = {
    isFavourite: boolean;
    isRated: boolean;
    isVisited: boolean;
};

type MapUserFilter = "onlyFavourites" | "onlyVisited";

export const getMapTowerPersonalStatuses = ({
    isFavourite,
    isRated = false,
    isVisited,
}: Omit<MapTowerPersonalStatuses, "isRated"> &
    Partial<Pick<MapTowerPersonalStatuses, "isRated">>) => {
    return { isFavourite, isRated, isVisited };
};

export const isGoneTower = ({ openingHours }: Pick<MapTowerFilterTarget, "openingHours">) => {
    return (
        openingHours.type === OpeningHoursType.Forbidden &&
        openingHours.forbiddenType === OpeningHoursForbiddenType.Gone
    );
};

export const isPermanentlyUnavailableTower = ({
    openingHours,
}: Pick<MapTowerFilterTarget, "openingHours">) => {
    return (
        openingHours.type === OpeningHoursType.Forbidden &&
        (openingHours.forbiddenType === OpeningHoursForbiddenType.Gone ||
            openingHours.forbiddenType === OpeningHoursForbiddenType.Banned)
    );
};

export const filterPermanentlyUnavailableTowers = <
    Tower extends Pick<MapTowerFilterTarget, "openingHours">,
>(
    towers: Tower[]
): Tower[] => {
    return towers.filter((tower): tower is Tower => !isPermanentlyUnavailableTower(tower));
};

export const toggleExclusiveMapUserFilter = (
    filters: Pick<MapTowerFilters, MapUserFilter>,
    filter: MapUserFilter,
    checked: boolean
) => {
    if (!checked) {
        return { ...filters, [filter]: false };
    }

    return {
        onlyFavourites: filter === "onlyFavourites",
        onlyVisited: filter === "onlyVisited",
    };
};

export const filterMapTowers = <Tower extends MapTowerFilterTarget>(
    towers: Tower[],
    filters: MapTowerFilters
) => {
    return towers.filter((tower) => {
        if (filters.onlyVisited && !tower.isVisited) {
            return false;
        }

        if (filters.onlyFavourites && !tower.isFavourite) {
            return false;
        }

        return (
            !isPermanentlyUnavailableTower(tower) ||
            filters.includeGone ||
            tower.isVisited ||
            tower.isFavourite
        );
    });
};
