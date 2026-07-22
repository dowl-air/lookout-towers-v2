import { TowersSearchParams } from "@/types/TowersSearchParams";

const hasValue = (value: string | number | string[] | undefined) =>
    Array.isArray(value) ? value.length > 0 : value !== undefined && value !== "";

export const shouldNoIndexTowersCatalog = (searchParams?: TowersSearchParams) =>
    Object.entries(searchParams ?? {}).some(([key, value]) => {
        if (key === "page") return hasValue(value) && value !== "1" && value !== 1;

        return hasValue(value);
    });
