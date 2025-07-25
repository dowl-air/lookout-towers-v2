import { CountryCode } from "@/constants/countries";
import { TowerTypeEnum } from "@/constants/towerType";
import { Admission } from "@/types/Admission";
import type { OpeningHours } from "@/types/OpeningHours";
import type { TowerTag } from "@/types/TowerTags";
import type { GeoPoint } from "firebase/firestore";

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
