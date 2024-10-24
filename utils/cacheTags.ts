export const enum CacheTag {
    Towers = "Towers",
    Tower = "Tower",
    TowerRatingAndCount = "TowerRatingAndCount",
    TowerOfTheDay = "TowerOfTheDay",
}

export const getCacheTagSpecific = (tag: CacheTag, id: string | number): string => `${tag}-${id}`;
