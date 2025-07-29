import { closest } from "fastest-levenshtein";

import COUNTRIES, { CountryCode } from "@/constants/countries";
import PROVINCES_AT from "@/constants/provinces/AT";
import PROVINCES_CZ from "@/constants/provinces/CZ";
import PROVINCES_DE from "@/constants/provinces/DE";
import PROVINCES_HU from "@/constants/provinces/HU";
import PROVINCES_PL from "@/constants/provinces/PL";
import PROVINCES_SK from "@/constants/provinces/SK";

export const getCountryByCode = (countryCode: CountryCode) => {
    return COUNTRIES.find((country) => country.code === countryCode);
};

export const getCountryByName = (countryName: string) => {
    return COUNTRIES.find((country) => country.name === countryName);
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

export const getAllCountiesFromCountryProvince = (countryCode: CountryCode, provinceCode: string): string[] => {
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
        .replace(/wojew[oó]dztwo|woj|powiat|county|gmina/g, "")
        .replace(/[^a-ząćęłńóśźż0-9\s-]/gi, "")
        .replace(/\s+/g, " ")
        .trim();
}

export const findInfoByGPS = async (gps: {
    lat: number;
    lng: number;
}): Promise<null | { name: string; countryCode: string; provinceCode: string; county: string }> => {
    const { lat, lng } = gps;

    const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=local`, {
        headers: {
            "User-Agent": "RozhlednovySvet/1.0 (https://www.rozhlednovysvet.cz)",
            Accept: "application/json",
        },
    });

    if (!resp.ok) {
        return null;
    }

    const data = await resp.json();

    console.log("Nominatim response:", data);

    if (!data || !data.address) {
        return null;
    }

    const result = {
        name: "",
        countryCode: "",
        provinceCode: "",
        county: "",
    };

    if (data.type === "tower" || data.type === "building" || data.type === "point_of_interest" || data.type === "viewpoint") {
        result.name = data.name;
    }

    const countryCode = data.address?.country_code?.toUpperCase();
    if (countryCode) {
        result.countryCode = countryCode;
    }

    let province = data.address?.state || "";
    if (province && result.countryCode) {
        const match = closest(
            normalizeName(province),
            getAllCountryProvinces(countryCode).map((p) => p.name)
        );
        result.provinceCode = getProvinceByName(countryCode, match)?.code || "";
    }

    const county = data.address?.county || data.address?.city || data.address?.town || "";
    if (county && result.provinceCode) {
        result.county = closest(normalizeName(county), getAllCountiesFromCountryProvince(result.countryCode as CountryCode, result.provinceCode));
    }

    return result;
};
