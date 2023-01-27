export type Tower = {
    access?: string;
    country: string;
    county?: string;
    created: Date;
    elevation?: number;
    gps?: GeolocationCoordinates;
    gpshash?: string;
    height?: 55;
    history?: string;
    id: string;
    locationText?: string;
    mainPhotoUrl: string;
    material?: [string];
    modified?: Date;
    name: string;
    nameID: string;
    opened?: Date;
    openingHours?: string; //todo
    price?: number; //todo 
    province?: string;
    stairs?: number;
    type: string;
    urls?: [string];
    viewText?: string;
    visits?: number; //todo
}