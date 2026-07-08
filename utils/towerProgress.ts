import { TowerCollectionDTO } from "@/data/tower/towers-collection";
import { OpeningHoursForbiddenType, OpeningHoursType } from "@/types/OpeningHours";

export const isExcludedFromTowerProgress = (tower: TowerCollectionDTO): boolean => {
    if (tower.openingHours?.type !== OpeningHoursType.Forbidden) {
        return false;
    }

    return ![
        OpeningHoursForbiddenType.Reconstruction,
        OpeningHoursForbiddenType.Temporary,
    ].includes(tower.openingHours.forbiddenType);
};

export const getTowerProgressText = (visitedCount: number, totalCount: number): string => {
    if (totalCount === 0) {
        return "0 %";
    }

    return `${Math.round((visitedCount / totalCount) * 100)} %`;
};

export const getTowerProgressPercent = (visitedCount: number, totalCount: number): number => {
    if (totalCount === 0) {
        return 0;
    }

    return Math.round((visitedCount / totalCount) * 100);
};

export const getAccessibleTowerProgress = (
    towers: TowerCollectionDTO[],
    visitedTowerIds: Set<string>
) => {
    const accessibleTowers = towers.filter((tower) => !isExcludedFromTowerProgress(tower));
    const visitedAccessibleCount = accessibleTowers.filter((tower) =>
        visitedTowerIds.has(tower.id)
    ).length;

    return {
        accessibleTowers,
        progressPercent: getTowerProgressPercent(visitedAccessibleCount, accessibleTowers.length),
        progressText: getTowerProgressText(visitedAccessibleCount, accessibleTowers.length),
        totalAccessibleCount: accessibleTowers.length,
        visitedAccessibleCount,
    };
};
