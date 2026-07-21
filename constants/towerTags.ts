import {
    Accessibility,
    Bike,
    Bus,
    CalendarCheck,
    Coffee,
    CreditCard,
    Droplets,
    KeyRound,
    ListEnd,
    PanelTop,
    ParkingCircle,
    PlugZap,
    ShieldAlert,
    Signpost,
    Telescope,
    Toilet,
    TriangleAlert,
    Umbrella,
    Utensils,
    Wifi,
    Wrench,
    type LucideIcon,
} from "lucide-react";

import { TowerTag } from "@/types/TowerTags";

export type TowerTagCategory = "access" | "equipment";

export const TOWER_TAG_DETAILS: Record<
    TowerTag,
    { category: TowerTagCategory; Icon: LucideIcon; isSafety?: boolean; label: string }
> = {
    [TowerTag.HasTelescope]: { category: "equipment", label: "Dalekohled k dispozici", Icon: Telescope },
    [TowerTag.HasObservationBoards]: {
        category: "equipment",
        label: "Výhledové popisné tabule",
        Icon: PanelTop,
    },
    [TowerTag.IsNearTouristGuide]: {
        category: "access",
        label: "Rozcestník v blízkosti",
        Icon: Signpost,
    },
    [TowerTag.HasParking]: {
        category: "access",
        label: "Parkoviště u rozhledny",
        Icon: ParkingCircle,
    },
    [TowerTag.IsNearPublicTransport]: {
        category: "access",
        label: "Veřejná doprava v blízkosti",
        Icon: Bus,
    },
    [TowerTag.NeedToBorrowKey]: {
        category: "access",
        label: "Nutné zapůjčit klíč",
        Icon: KeyRound,
    },
    [TowerTag.NeedToBookVisit]: {
        category: "access",
        label: "Nutné domluvit návštěvu předem",
        Icon: CalendarCheck,
    },
    [TowerTag.SuitableForCyclists]: {
        category: "access",
        label: "Vhodné i pro cyklisty",
        Icon: Bike,
    },
    [TowerTag.WheelchairAccessible]: {
        category: "access",
        label: "Bezbariérový přístup",
        Icon: Accessibility,
    },
    [TowerTag.HasToilet]: { category: "equipment", label: "Toaleta", Icon: Toilet },
    [TowerTag.HasRestaurant]: { category: "equipment", label: "Restaurace", Icon: Utensils },
    [TowerTag.HasSnacks]: { category: "equipment", label: "Drobné občerstvení", Icon: Coffee },
    [TowerTag.HasWifi]: { category: "equipment", label: "Wifi", Icon: Wifi },
    [TowerTag.CanPayByCard]: { category: "equipment", label: "Možnost platit kartou", Icon: CreditCard },
    [TowerTag.HasShelter]: { category: "equipment", label: "Přístřešek", Icon: Umbrella },
    [TowerTag.HasBikeRepairStation]: {
        category: "equipment",
        label: "Opravný stojan na kolo",
        Icon: Wrench,
    },
    [TowerTag.HasElectricCharger]: {
        category: "equipment",
        label: "Nabíječka pro elektrické prostředky",
        Icon: PlugZap,
    },
    [TowerTag.HasSteepStairs]: {
        category: "access",
        isSafety: true,
        label: "Příkré schody",
        Icon: TriangleAlert,
    },
    [TowerTag.HasSmallRailings]: {
        category: "access",
        isSafety: true,
        label: "Nízké zábradlí",
        Icon: ShieldAlert,
    },
    [TowerTag.HasSlipperySurface]: {
        category: "access",
        isSafety: true,
        label: "Kluzké povrchy",
        Icon: Droplets,
    },
    [TowerTag.HasLadder]: {
        category: "access",
        isSafety: true,
        label: "Výstup po žebříku",
        Icon: ListEnd,
    },
};
