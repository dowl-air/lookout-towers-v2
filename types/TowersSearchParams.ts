import { CountryCode } from "@/constants/countries";

export type TowersSearchParams = {
    query?: string;
    page?: number;
    country?: CountryCode;
    province?: string;
    county?: string;
    location?: string;
    sort?: string;
    showFilter?: string;
};
