import { OpeningHours } from "@/types/OpeningHours";
import { GeoPoint } from "firebase/firestore";

export type Tower = {
    isVisited?: boolean; // only in map
    isFavourite?: boolean; //only in map
    access?: string; // todo make it structured
    country: string;
    county?: string;
    created: string | Date;
    elevation: number;
    gps:
        | GeoPoint
        | {
              latitude: number;
              longitude: number;
          };
    gpshash?: string;
    height: number;
    history?: string; //todo make it structured
    id: string;
    locationText?: string; //todo merge to access
    mainPhotoUrl: string;
    material: [string];
    modified: string | Date;
    name: string;
    nameID: string;
    opened: string | Date;
    openingHours: OpeningHours;
    price?: number; //todo
    province?: string;
    stairs: number;
    type: string;
    urls?: [string];
    viewText?: string;
    visits?: number; //todo
};
