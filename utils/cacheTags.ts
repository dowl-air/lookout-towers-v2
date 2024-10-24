export const enum CacheTag {
    // todo? all tower objects - revalidate when a new tower is added or removed or edited
    Towers = "Towers",

    // revalidates every 2 hours automatically
    RandomTowers = "RandomTowers",

    // todo? [SPECIFIC towerID] revalidate when tower photo is added, edited or removed
    TowerGallery = "TowerGallery",

    // todo? tower object - revalidate only with specific id when edited, or removed
    Tower = "Tower",

    // [SPECIFIC towerID userID] revalidate when user favourites or unfavourites tower
    TowerFavourite = "TowerFavourite",

    // tower rating - revalidate with specific tower ID when added, edited or removed
    TowerRatingAndCount = "TowerRatingAndCount",
    TowerRatings = "TowerRatings",

    // revalidate with specific tower ID when added or removed
    TowerVisitsCount = "TowerVisitsCount",
    TowerVisits = "TowerVisits",

    // revalidates automatically every hour
    TowerOfTheDay = "TowerOfTheDay",

    // todo? revalidate when tower is added or removed
    TowersCount = "TowersCount",

    // revalidate when user is added
    UsersCount = "UsersCount",

    // todo? revalidate when new change is published
    ChangesCount = "ChangesCount",

    // revalidate when rating is added or removed
    RatingsCount = "RatingsCount",

    // revalidate when new visit is added or removed
    VisitsCount = "VisitsCount",

    // todo? revalidate when change is published
    LastChangeDate = "LastChangeDate",

    // todo update specific user when user is edited
    User = "User",

    // [SPECIFIC userID] revalidate when user rating is added or edited
    UserRatings = "UserRatings",

    // [SPECIFIC towerID userID] revalidate when user rating is added or edited
    UserTowerRating = "UserTowerRating",

    // [SPECIFIC userID] revalidate when user adds visit or removes visit
    UserVisits = "UserVisits",

    // [SPECIFIC towerID userID] revalidate when user visit is added or edited
    UserTowerVisit = "UserTowerVisit",
}

export const getCacheTagSpecific = (tag: CacheTag, id: string | number): string => `${tag}-${id}`;

export const getCacheTagUserSpecific = (tag: CacheTag, userID: string, id: string | number): string => `${tag}-${id}-${userID}`;
