export const enum CacheTag {
    Towers = "Towers",
    RandomTowers = "RandomTowers",
    Tower = "Tower",
    TowerRatingAndCount = "TowerRatingAndCount",
    TowerOfTheDay = "TowerOfTheDay",
}

export const getCacheTagSpecific = (tag: CacheTag, id: string | number): string => `${tag}-${id}`;
