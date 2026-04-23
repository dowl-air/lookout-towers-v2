export const HOMEPAGE_TITLE = "Rozhledny, věže a vyhlídky po Česku";

export const HOMEPAGE_DESCRIPTION =
    "Objevujte rozhledny, věže a vyhlídky po celém Česku. Procházejte mapu, plánujte výlety a ukládejte si místa, která stojí za návštěvu.";

export const HOMEPAGE_CANONICAL_URL = "https://rozhlednovysvet.cz/";

export const HOMEPAGE_SHARE_IMAGE_ALT = "Rozhlednový svět - rozhledny, věže a vyhlídky po Česku";

export const HOMEPAGE_OPEN_GRAPH_IMAGE_PATH = "/opengraph-image";

export const HOMEPAGE_TWITTER_IMAGE_PATH = "/twitter-image";

export const homepageJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebSite",
            "@id": `${HOMEPAGE_CANONICAL_URL}#website`,
            url: HOMEPAGE_CANONICAL_URL,
            name: "Rozhlednový svět",
            description: HOMEPAGE_DESCRIPTION,
            inLanguage: "cs-CZ",
            potentialAction: {
                "@type": "SearchAction",
                target: {
                    "@type": "EntryPoint",
                    urlTemplate: "https://rozhlednovysvet.cz/rozhledny?query={search_term_string}",
                },
                "query-input": "required name=search_term_string",
            },
        },
        {
            "@type": "Organization",
            "@id": `${HOMEPAGE_CANONICAL_URL}#organization`,
            name: "Rozhlednový svět",
            url: HOMEPAGE_CANONICAL_URL,
            description: HOMEPAGE_DESCRIPTION,
            logo: {
                "@type": "ImageObject",
                url: "https://rozhlednovysvet.cz/img/logo.png",
            },
            sameAs: ["https://www.instagram.com/rozhlednovysvet/"],
        },
    ],
};
