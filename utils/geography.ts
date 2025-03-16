import COUNTRIES, { CountryCode } from "@/constants/countries";
import PROVINCES_CZ from "@/constants/provinces/CZ";
import PROVINCES_SK from "@/constants/provinces/SK";

export const getCountryByCode = (countryCode: CountryCode) => {
    return COUNTRIES.find((country) => country.code === countryCode);
};

export const getProvinceByCode = (countryCode: CountryCode, provinceCode: string) => {
    const provinces = getAllCountryProvinces(countryCode);
    return provinces.find((province) => province.code === provinceCode);
};

export const getAllCountryProvinces = (countryCode: CountryCode): typeof PROVINCES_CZ => {
    switch (countryCode) {
        case "CZ":
            return PROVINCES_CZ;
        case "SK":
            return PROVINCES_SK;
        case "PL":
            return [];
        case "HU":
            return [];
        case "AT":
            return [];
        case "DE":
            return [];
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
