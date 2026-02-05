export const enum CacheTag {
    // todo? all tower objects - revalidate when a new tower is added or removed or edited
    Towers = "Towers",

    TowersMap = "TowersMap",

    // this cache is revalidated every 2 hours automatically
    Photo = "Photo",

    // revalidates every 2 hours automatically
    RandomTowers = "RandomTowers",

    // todo? [SPECIFIC towerID] revalidate when tower photo is added, edited or removed
    TowerGallery = "TowerGallery",

    // tower object - revalidate only with specific id when edited, or removed
    Tower = "Tower",

    // [SPECIFIC towerID userID] revalidate when user favourites or unfavourites tower
    TowerFavourite = "TowerFavourite",

    // [SPECIFIC userID] revalidate when user favourites or unfavourites tower
    UserFavourites = "UserFavourites",

    // tower rating - revalidate with specific tower ID when added, edited or removed
    TowerRatingAndCount = "TowerRatingAndCount",
    TowerRatings = "TowerRatings",

    // revalidate with specific tower ID when added or removed
    TowerVisitsCount = "TowerVisitsCount",
    TowerVisits = "TowerVisits",

    // todo? revalidate with specific tower ID when tower photo is added or removed
    TowerPhotos = "TowerPhotos",

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

    // revalidate when change is published
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

    // [SPECIFIC ID] revalidate when change is published or edited
    Change = "Change",

    // all changes create or update
    UnresolvedChanges = "UnresolvedChanges",

    // [SPECIFIC towerID] revalidate when change is published or edited
    ChangesTower = "ChangesTower",

    // [SPECIFIC userID] revalidate when change is published or edited
    ChangesUser = "ChangesUser",
}

export const getCacheTagSpecific = (tag: CacheTag, id: string | number): string => `${tag}-${id}`;

export const getCacheTagUserSpecific = (
    tag: CacheTag,
    userID: string,
    id: string | number
): string => `${tag}-${id}-${userID}`;
