import { CountryCode } from "@/constants/countries";

export type TowersSearchParams = {
    query?: string;
    page?: number;
    countryCode?: CountryCode;
    provinceCode?: string;
    county?: string;
    location?: string;
    sort?: string;
    showFilter?: string;
};
