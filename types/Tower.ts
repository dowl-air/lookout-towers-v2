import type { GeoPoint } from "firebase/firestore";

import { CountryCode } from "@/constants/countries";
import { TowerTypeEnum } from "@/constants/towerType";
import { Admission } from "@/types/Admission";
import type { OpeningHours } from "@/types/OpeningHours";
import type { TowerTag } from "@/types/TowerTags";

type MapyCz = {
    href: string;
    id: string;
    lastMapped: string | Date;
    mapped?: {
        urls?: {
            href: string;
            name: string;
        }[];
    };
    name: string;
    source: string;
    type: string;
};

type GMaps = {
    placeId: string;
    url: string;
    business_status?: string;
    mappedAt?: string | Date;
    name: string;
    rating?: number;
    wheelchair_accessible_entrance?: boolean;
};

export type Tower = {
    access?: string; // todo merge to description
    admission?: Admission;
    country: string | CountryCode;
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
    locationText?: string; //todo merge to description
    mainPhotoUrl: string;
    mapycz?: MapyCz;
    gmaps?: GMaps;
    material: string[];
    modified: string | Date;
    name: string;
    nameID: string;
    observationDecksCount?: number;
    opened: string | Date;
    openingHours: OpeningHours;
    owner?: string;
    province?: string;
    stairs: number;
    tags?: TowerTag[];
    type: TowerTypeEnum;
    urls?: [string];
    viewText?: string; //todo merge to description
    viewHeight?: number;
    visits?: number; //todo
};
