const COUNTRIES = [
    {
        name: "Česko",
        code: "CZ",
        emoji: "🇨🇿",
    },
    {
        name: "Slovensko",
        code: "SK",
        emoji: "🇸🇰",
    },
    {
        name: "Polsko",
        code: "PL",
        emoji: "🇵🇱",
    },
    {
        name: "Maďarsko",
        code: "HU",
        emoji: "🇭🇺",
    },
    {
        name: "Rakousko",
        code: "AT",
        emoji: "🇦🇹",
    },
    {
        name: "Německo",
        code: "DE",
        emoji: "🇩🇪",
    },
] as const;

export default COUNTRIES;

export type CountryCode = (typeof COUNTRIES)[number]["code"];
