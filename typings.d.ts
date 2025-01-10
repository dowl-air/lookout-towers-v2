import { GeoPoint, Timestamp } from "firebase/firestore";
import { OpeningHours } from "@/types/OpeningHours";

export type GPS = {
    latitude: number;
    longitude: number;
};

export type Session = {
    authenticated?: Boolean;
    user?: User;
};

export type User =
    | {
          name?: string | undefined | null;
          email?: string | undefined | null;
          image?: string | undefined | null;
          id?: string | undefined | null;
          visits?: number | undefined | null;
          changes?: number | undefined | null;
          lastVisited?: { tower: Tower; date: string } | undefined | null;
      }
    | undefined;

export type UserFromDB = {
    email: string;
    name: string;
    emailVerified: boolean | null;
    image: string;
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
    openingHours: OpeningHours;
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
    };
};

export type Tower = {
    isVisited?: boolean;
    isFavourite?: boolean;
    access?: string;
    country: string;
    county?: string;
    created: string;
    elevation: number;
    gps: GeoPoint | GPS;
    gpshash?: string;
    height: number;
    history?: string;
    id: string;
    locationText?: string;
    mainPhotoUrl: string;
    material: [string];
    modified: string;
    name: string;
    nameID: string;
    opened: string;
    openingHours: OpeningHours;
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
    };
};

export type Rating = {
    tower_id: string;
    user_id: string;
    rating: number;
    created: string;
    text: string;
    user?: User;
};

export type Visit = {
    tower_id: string;
    user_id: string;
    date: string;
    text: string;
    created: string;
    urls?: string[];
};
