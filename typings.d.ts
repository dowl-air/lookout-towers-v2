import { GeoPoint, Timestamp } from "firebase/firestore";

export type GPS = {
    latitude: number,
    longitude: number
}

export type Filter = {
    searchTerm: string;
};


export type TowerFirebase = {
    access?: string;
    country: string;
    county?: string;
    created: Timestamp;
    elevation: number;
    gps: GeoPoint;
    gpshash?: string;
    height: 55;
    history?: string;
    id: string;
    locationText?: string;
    mainPhotoUrl: string;
    material: [string];
    modified: Timestamp;
    name: string;
    nameID: string;
    opened: Timestamp;
    openingHours?: string; //todo
    price?: number; //todo
    province?: string;
    stairs: number;
    type: string;
    urls?: [string];
    viewText?: string;
    visits?: number; //todo
    rating?: {
        avg: number;
        count: number;
    }
}

export type Tower = {
    access?: string;
    country: string;
    county?: string;
    created: Timestamp | Date;
    elevation: number;
    gps: GeoPoint | GPS;
    gpshash?: string;
    height: 55;
    history?: string;
    id: string;
    locationText?: string;
    mainPhotoUrl: string;
    material: [string];
    modified: Date;
    name: string;
    nameID: string;
    opened: Date;
    openingHours?: string; //todo
    price?: number; //todo
    province?: string;
    stairs: number;
    type: string;
    urls?: [string];
    viewText?: string;
    visits?: number; //todo
    rating?: {
        avg: number;
        count: number;
    }
}

export type Rating = {
    tower_id: string;
    user_id: string;
    value: number;
}