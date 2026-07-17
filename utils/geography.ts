import { closest } from "fastest-levenshtein";

import COUNTRIES, { CountryCode } from "@/constants/countries";
import PROVINCES_AT from "@/constants/provinces/AT";
import PROVINCES_CZ from "@/constants/provinces/CZ";
import PROVINCES_DE from "@/constants/provinces/DE";
import PROVINCES_HU from "@/constants/provinces/HU";
import PROVINCES_PL from "@/constants/provinces/PL";
import PROVINCES_SK from "@/constants/provinces/SK";
import { Tower } from "@/types/Tower";

const COUNTRY_DISPLAY_NAMES: Record<CountryCode, string> = {
    AT: "Rakousko",
    CZ: "Česko",
    DE: "Německo",
    HU: "Maďarsko",
    PL: "Polsko",
    SK: "Slovensko",
};

export const getCountryByCode = (countryCode: CountryCode) => {
    return COUNTRIES.find((country) => country.code === countryCode);
};

export const getCountryByName = (countryName: string) => {
    return COUNTRIES.find((country) => country.name === countryName);
};

export const getCountryByValue = (countryValue?: string | null) => {
    if (!countryValue) return undefined;

    if (isValidCountryCode(countryValue)) return getCountryByCode(countryValue);

    return COUNTRIES.find(
        (country) =>
            country.name === countryValue ||
            COUNTRY_DISPLAY_NAMES[country.code] === countryValue ||
            country.code === countryValue
    );
};

export const formatCountryName = (countryValue?: string | null): string => {
    const country = getCountryByValue(countryValue);

    if (!country) return countryValue || "neznámá země";

    return COUNTRY_DISPLAY_NAMES[country.code];
};

export const isValidCountryCode = (countryCode: string): countryCode is CountryCode => {
    return COUNTRIES.some((country) => country.code === countryCode);
};

export const getProvinceByCode = (countryCode: CountryCode, provinceCode: string) => {
    const provinces = getAllCountryProvinces(countryCode);
    return provinces.find((province) => province.code === provinceCode);
};

export const getProvinceByName = (countryCode: CountryCode, provinceName: string) => {
    const provinces = getAllCountryProvinces(countryCode);
    return provinces.find((province) => province.name === provinceName);
};

export const getProvinceByValue = (countryCode: CountryCode, provinceValue?: string | null) => {
    if (!provinceValue) return undefined;

    const provinces = getAllCountryProvinces(countryCode);

    return provinces.find(
        (province) =>
            province.code === provinceValue ||
            province.name === provinceValue ||
            province.shortName === provinceValue
    );
};

export const formatProvinceName = (
    countryValue?: string | null,
    provinceValue?: string | null
): string => {
    const country = getCountryByValue(countryValue);

    if (!country) return provinceValue || "neznámý kraj";

    return getProvinceByValue(country.code, provinceValue)?.name || provinceValue || "neznámý kraj";
};

export const formatCountyName = (countyValue?: string | null): string => {
    return countyValue || "neznámý okres";
};

export const formatTowerPlaceLabels = (
    tower: Pick<Tower, "country" | "county" | "province">
): { placeLabel: string; regionLabel: string } => {
    const countyLabel = tower.county ? formatCountyName(tower.county) : null;
    const provinceLabel = tower.province ? formatProvinceName(tower.country, tower.province) : null;
    const countryLabel = formatCountryName(tower.country);

    return {
        placeLabel: countyLabel || provinceLabel || countryLabel,
        regionLabel: provinceLabel || countryLabel,
    };
};

export const isValidProvinceCode = (countryCode: CountryCode, provinceCode: string): boolean => {
    const provinces = getAllCountryProvinces(countryCode);
    return provinces.some((province) => province.code === provinceCode);
};

export const getAllCountryProvinces = (countryCode: CountryCode): typeof PROVINCES_CZ => {
    switch (countryCode) {
        case "CZ":
            return PROVINCES_CZ;
        case "SK":
            return PROVINCES_SK;
        case "PL":
            return PROVINCES_PL;
        case "HU":
            return PROVINCES_HU;
        case "AT":
            return PROVINCES_AT;
        case "DE":
            return PROVINCES_DE;
        default:
            return [];
    }
};

export const getAllCountiesFromCountry = (countryCode: CountryCode): string[] => {
    const provinces = getAllCountryProvinces(countryCode);
    return provinces
        .reduce((acc, province) => {
            return [...acc, ...province.counties];
        }, [])
        .filter(Boolean);
};

export const getAllCountiesFromCountryProvince = (
    countryCode: CountryCode,
    provinceCode: string
): string[] => {
    const provinces = getAllCountryProvinces(countryCode);
    const province = provinces.find((p) => p.code === provinceCode);
    return province ? province.counties : [];
};

export const getProvinceByCounty = (countryCode: CountryCode, county: string) => {
    const provinces = getAllCountryProvinces(countryCode);
    return provinces.find((province) => province.counties.includes(county));
};

function normalizeName(name) {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/wojew[oó]dztwo|woj|powiat|county|district|okres|gmina/g, "")
        .replace(/[^a-ząćęłńóśźż0-9\s-]/gi, "")
        .replace(/\s+/g, " ")
        .trim();
}

type NominatimResponse = {
    address?: {
        city?: string;
        country_code?: string;
        county?: string;
        district?: string;
        municipality?: string;
        region?: string;
        state?: string;
        town?: string;
    };
    name?: string;
    type?: string;
};

export const mapNominatimAddress = (
    data: NominatimResponse
): null | { name: string; countryCode: string; provinceCode: string; county: string } => {
    if (!data?.address) return null;

    const result = {
        name: "",
        countryCode: "",
        provinceCode: "",
        county: "",
    };

    if (
        data.type === "tower" ||
        data.type === "building" ||
        data.type === "point_of_interest" ||
        data.type === "viewpoint"
    ) {
        result.name = data.name || "";
    }

    const countryCode = data.address.country_code?.toUpperCase();
    if (!countryCode || !isValidCountryCode(countryCode)) return result;

    result.countryCode = countryCode;
    const provinces = getAllCountryProvinces(countryCode);
    const provinceName = data.address.state || data.address.region || "";
    const normalizedProvinceNames = provinces.map((province) => normalizeName(province.name));
    const matchedProvinceName = provinceName
        ? closest(normalizeName(provinceName), normalizedProvinceNames)
        : "";
    const province = provinces.find(
        (candidate) => normalizeName(candidate.name) === matchedProvinceName
    );

    if (!province) return result;

    result.provinceCode = province.code;
    const countyName =
        data.address.county ||
        data.address.district ||
        data.address.city ||
        data.address.town ||
        data.address.municipality ||
        "";
    const normalizedCountyNames = province.counties.map(normalizeName);
    const matchedCountyName = countyName
        ? closest(normalizeName(countyName), normalizedCountyNames)
        : "";
    const county = province.counties.find(
        (candidate) => normalizeName(candidate) === matchedCountyName
    );

    result.county = county || "";

    return result;
};

export const findInfoByGPS = async (gps: {
    lat: number;
    lng: number;
}): Promise<null | { name: string; countryCode: string; provinceCode: string; county: string }> => {
    const { lat, lng } = gps;

    const resp = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=local`,
        {
            headers: {
                "User-Agent": "RozhlednovySvet/1.0 (https://www.rozhlednovysvet.cz)",
                Accept: "application/json",
            },
        }
    );

    if (!resp.ok) {
        return null;
    }

    const data = (await resp.json()) as NominatimResponse;

    return mapNominatimAddress(data);
};
