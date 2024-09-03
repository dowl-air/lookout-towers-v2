import { GeoPoint, Timestamp } from "firebase/firestore";
import { OpeningHoursForbiddenType, OpeningHoursType } from "./utils/constants";

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

export type Filter = {
    searchTerm: string;
    province: string;
    county: string;
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
    isFavourite?: boolean;
    access?: string;
    country: string;
    county?: string;
    created: Timestamp | Date;
    elevation: number;
    gps: GeoPoint | GPS;
    gpshash?: string;
    height: number;
    history?: string;
    id: string;
    locationText?: string;
    mainPhotoUrl: string;
    material: [string];
    modified: Date;
    name: string;
    nameID: string;
    opened: Date;
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
    created: Date;
    text: string;
    user?: User;
};

export type Visit = {
    tower_id: string;
    user_id: string;
    date: Date;
    text: string;
    created: Date;
};

export type OpeningHours = {
    type: OpeningHoursType;
    months?: number[];
    days?: number[];
    forbidden_type?: OpeningHoursForbiddenType;
    time_start?: number;
    time_end?: number;
    lunch_break?: boolean;
    lunch_start?: number;
    lunch_end?: number;
    note?: string;
};

type SearchResult = {
    name: string;
    name_nospaces: string;
    type: string;
    opened: Date;
    country: string;
    county: string;
    province: string;
    id: string;
};
