const COUNTRIES = [
    {
        name: "Czechia",
        code: "CZ",
        emoji: "🇨🇿",
    },
    {
        name: "Slovakia",
        code: "SK",
        emoji: "🇸🇰",
    },
    {
        name: "Poland",
        code: "PL",
        emoji: "🇵🇱",
    },
    {
        name: "Hungary",
        code: "HU",
        emoji: "🇭🇺",
    },
    {
        name: "Austria",
        code: "AT",
        emoji: "🇦🇹",
    },
    {
        name: "Germany",
        code: "DE",
        emoji: "🇩🇪",
    },
] as const;

export default COUNTRIES;

export type CountryCode = (typeof COUNTRIES)[number]["code"];
