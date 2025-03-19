import type { OpeningHours } from "@/types/OpeningHours";
import type { TowerTag } from "@/types/TowerTags";
import type { GeoPoint } from "firebase/firestore";

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
    material: string[];
    modified: string | Date;
    name: string;
    nameID: string;
    observationDecksCount?: number;
    opened: string | Date;
    openingHours: OpeningHours;
    owner?: string;
    price?: number; //todo
    province?: string;
    stairs: number;
    tags?: Record<TowerTag, boolean>;
    type: string;
    urls?: [string];
    viewText?: string;
    viewHeight?: number;
    visits?: number; //todo
};
