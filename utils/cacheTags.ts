export const enum CacheTag {
    // todo all tower objects - revalidate when a new tower is added or removed or edited
    Towers = "Towers",

    // revalidates every 2 hours automatically
    RandomTowers = "RandomTowers",

    // todo tower object - revalidate only with specific id when edited
    Tower = "Tower",

    // tower rating - revalidate with specific tower ID when added, edited or removed
    TowerRatingAndCount = "TowerRatingAndCount",

    // revalidates automatically every hour
    TowerOfTheDay = "TowerOfTheDay",

    // todo revalidate when tower is added or removed
    TowersCount = "TowersCount",

    // todo revalidate when user is added or removed
    UsersCount = "UsersCount",

    // todo revalidate when new change is published
    ChangesCount = "ChangesCount",

    // todo revalidate when rating is added or removed
    RatingsCount = "RatingsCount",

    // todo revalidate when new visit is added
    VisitsCount = "VisitsCount",

    // todo revalidate when change is published
    LastChangeDate = "LastChangeDate",
}

export const getCacheTagSpecific = (tag: CacheTag, id: string | number): string => `${tag}-${id}`;
