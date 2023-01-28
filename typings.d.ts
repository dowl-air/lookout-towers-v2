import { GeoPoint, Timestamp } from "firebase/firestore";

export type Tower = {
    access?: string;
    country: string;
    county?: string;
    created: Timestamp | Date;
    elevation?: number;
    gps: GeoPoint | {
        latitude: number,
        longitude: number
    };
    gpshash?: string;
    height?: 55;
    history?: string;
    id: string;
    locationText?: string;
    mainPhotoUrl: string;
    material?: [string];
    modified: Timestamp | Date;
    name: string;
    nameID: string;
    opened: Timestamp | Date;
    openingHours?: string; //todo
    price?: number; //todo
    province?: string;
    stairs?: number;
    type: string;
    urls?: [string];
    viewText?: string;
    visits?: number; //todo
}