import { CountryCode } from "@/constants/countries";
import { OpeningHoursForbiddenType } from "@/types/OpeningHours";
import { TowersSearchParams } from "@/types/TowersSearchParams";
import { getProvinceByCode, isValidCountryCode } from "@/utils/geography";

export class TowersFilter {
    private filters: string[] = [];

    constructor(searchParams: TowersSearchParams) {
        const countryCode: CountryCode = searchParams?.country;
        const provinceCode = searchParams?.province || "";
        const county = searchParams?.county || "";

        const showFilter = searchParams?.showFilter || "";

        if (isValidCountryCode(countryCode)) {
            if (countryCode === "CZ") {
                this.addFilter(`country:=Czechia`);
            } else {
                this.addFilter(`country:=${countryCode}`);
            }

            if (provinceCode && countryCode === "CZ") {
                this.addFilter(`province:=${getProvinceByCode(countryCode, provinceCode).name}`);
            } else if (provinceCode && countryCode) {
                this.addFilter(`province:=${getProvinceByCode(countryCode, provinceCode).code}`);
            }

            if (county && provinceCode && countryCode) this.addFilter(`county:=${county}`);
        }

        switch (showFilter) {
            case "showOnlyGone":
                this.addFilter(`openingHours.forbiddenType:=${OpeningHoursForbiddenType.Gone}`);
                break;
            case "showAll":
                break;
            default:
                this.addFilter(`openingHours.forbiddenType:!=${OpeningHoursForbiddenType.Gone}`);
                break;
        }
    }

    public addFilter(filter: string): void {
        this.filters.push(filter);
    }

    public getFilterString(): string {
        return this.filters.join(" && ");
    }
}
