import { MetadataRoute } from "next";

import { getAllTowersForSitemap } from "@/data/tower/towers-sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const towers = await getAllTowersForSitemap();
    const baseUrl = "https://www.rozhlednovysvet.cz";
    const now = new Date();

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: "daily",
        },
        {
            url: `${baseUrl}/rozhledny`,
            lastModified: now,
            changeFrequency: "weekly",
        },
        {
            url: `${baseUrl}/mapa`,
            lastModified: now,
            changeFrequency: "weekly",
        },
        /* {
            url: `${baseUrl}/komunita`,
            lastModified: now,
            changeFrequency: "weekly",
        }, */
    ];

    // Individual tower pages
    const towerPages: MetadataRoute.Sitemap = towers.map((t) => ({
        url: `${baseUrl}/${t.type}/${t.nameID}`,
        canonical: `${baseUrl}/${t.type}/${t.nameID}`,
        lastModified: t.modified.toISOString(),
        changeFrequency: "weekly",
    }));

    return [...staticPages, ...towerPages];
}
