import { CountryCode } from "@/constants/countries";

export type TowersSearchParams = {
    admission?: string | string[];
    query?: string;
    page?: number | string;
    country?: CountryCode;
    distance?: string;
    province?: string;
    county?: string;
    location?: string;
    material?: string | string[];
    maxHeight?: string;
    minHeight?: string;
    opening?: string | string[];
    sort?: string;
    showFilter?: string;
    tag?: string | string[];
    type?: string | string[];
};
