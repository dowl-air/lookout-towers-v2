import { CountryCode } from "@/constants/countries";
import { OpeningHoursForbiddenType } from "@/types/OpeningHours";
import { TowersSearchParams } from "@/types/TowersSearchParams";
import { getProvinceByCode, isValidCountryCode } from "@/utils/geography";

const asArray = (value?: string | string[]): string[] => {
    if (!value) return [];
    return Array.isArray(value) ? value.filter(Boolean) : [value].filter(Boolean);
};

const parseNumber = (value?: string): number | null => {
    if (!value) return null;

    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : null;
};

const formatStringValue = (value: string): string => `\`${value.replace(/`/g, "\\`")}\``;

const formatStringList = (values: string[]): string => values.map(formatStringValue).join(",");

const parseLocation = (location?: string): { latitude: number; longitude: number } | null => {
    if (!location) return null;

    const [latitude, longitude] = location.split(",").map(Number);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

    return { latitude, longitude };
};

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
                const province = getProvinceByCode(countryCode, provinceCode);
                if (province) this.addFilter(`province:=${formatStringValue(province.name)}`);
            } else if (provinceCode && countryCode) {
                const province = getProvinceByCode(countryCode, provinceCode);
                if (province) this.addFilter(`province:=${formatStringValue(province.code)}`);
            }

            if (county && provinceCode && countryCode) {
                this.addFilter(`county:=${formatStringValue(county)}`);
            }
        }

        const towerTypes = asArray(searchParams?.type);
        if (towerTypes.length > 0) this.addFilter(`type:=[${formatStringList(towerTypes)}]`);

        const openingTypes = asArray(searchParams?.opening).map(Number).filter(Number.isFinite);
        if (openingTypes.length > 0)
            this.addFilter(`openingHours.type:=[${openingTypes.join(",")}]`);

        const admissionTypes = asArray(searchParams?.admission);
        if (admissionTypes.length > 0) {
            this.addFilter(`admission.type:=[${formatStringList(admissionTypes)}]`);
        }

        const materials = asArray(searchParams?.material);
        if (materials.length > 0) this.addFilter(`material:=[${formatStringList(materials)}]`);

        const tags = asArray(searchParams?.tag);
        if (tags.length > 0) this.addFilter(`tags:=[${formatStringList(tags)}]`);

        const minHeight = parseNumber(searchParams?.minHeight);
        if (minHeight !== null) this.addFilter(`height:>=${minHeight}`);

        const maxHeight = parseNumber(searchParams?.maxHeight);
        if (maxHeight !== null) this.addFilter(`height:<=${maxHeight}`);

        const distance = parseNumber(searchParams?.distance);
        const location = parseLocation(searchParams?.location);
        if (distance !== null && location) {
            this.addFilter(`gps:(${location.latitude}, ${location.longitude}, ${distance} km)`);
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
