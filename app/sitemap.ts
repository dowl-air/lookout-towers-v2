import { MetadataRoute } from "next";

import { getAllTowers } from "@/actions/towers/towers.action";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const towers = await getAllTowers();
    const baseUrl = "https://www.rozhlednovysvet.cz";
    const now = new Date();

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/rozhledny`,
            lastModified: now,
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/mapa`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        /* {
            url: `${baseUrl}/komunita`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.6,
        }, */
    ];

    // Individual tower pages
    const towerPages: MetadataRoute.Sitemap = towers.map((t) => ({
        url: `${baseUrl}/${t.type}/${t.nameID}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
    }));

    return [...staticPages, ...towerPages];
}
