import { CountryCode } from "@/constants/countries";
import { Currency } from "@/types/Currency";

export const CURRENCY_SYMBOLS: Record<string, string> = {
    CZK: "Kč",
    EUR: "€",
    USD: "$",
    GBP: "£",
    JPY: "¥",
    AUD: "A$",
    CAD: "C$",
    CHF: "CHF",
    CNY: "¥",
    SEK: "kr",
};

export const CURRENCY_VALUES: Record<string, Currency> = {
    CZK: {
        label: "Czech Koruna",
        symbol: CURRENCY_SYMBOLS.CZK,
        code: "CZK",
    },
    EUR: {
        label: "Euro",
        symbol: CURRENCY_SYMBOLS.EUR,
        code: "EUR",
    },
    USD: {
        label: "United States Dollar",
        symbol: CURRENCY_SYMBOLS.USD,
        code: "USD",
    },
    GBP: {
        label: "British Pound",
        symbol: CURRENCY_SYMBOLS.GBP,
        code: "GBP",
    },
    JPY: {
        label: "Japanese Yen",
        symbol: CURRENCY_SYMBOLS.JPY,
        code: "JPY",
    },
    AUD: {
        label: "Australian Dollar",
        symbol: CURRENCY_SYMBOLS.AUD,
        code: "AUD",
    },
    CAD: {
        label: "Canadian Dollar",
        symbol: CURRENCY_SYMBOLS.CAD,
        code: "CAD",
    },
    CHF: {
        label: "Swiss Franc",
        symbol: CURRENCY_SYMBOLS.CHF,
        code: "CHF",
    },
    CNY: {
        label: "Chinese Yuan",
        symbol: CURRENCY_SYMBOLS.CNY,
        code: "CNY",
    },
    SEK: {
        label: "Swedish Krona",
        symbol: CURRENCY_SYMBOLS.SEK,
        code: "SEK",
    },
};

export const getCurrency = (country: string | CountryCode): Currency => {
    switch (country) {
        case "CZ":
        case "Czech Republic":
        case "Czechia":
        case "Czech":
            return CURRENCY_VALUES.CZK;
        case "SK":
        case "Slovakia":
        case "Slovak":
            return CURRENCY_VALUES.EUR;
        case "AT":
        case "Austria":
        case "DE":
        case "Germany":
            return CURRENCY_VALUES.EUR;
        default:
            return CURRENCY_VALUES.EUR;
    }
};
