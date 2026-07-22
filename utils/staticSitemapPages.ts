import type { MetadataRoute } from "next";

import { SITE_URL } from "@/utils/constants";

export const getStaticSitemapPages = (): MetadataRoute.Sitemap => [
    {
        url: SITE_URL,
        changeFrequency: "daily",
    },
    {
        url: `${SITE_URL}/rozhledny`,
        changeFrequency: "weekly",
    },
    {
        url: `${SITE_URL}/mapa`,
        changeFrequency: "weekly",
    },
];
