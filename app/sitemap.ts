import { MetadataRoute } from "next";

import { getAllTowersForSitemap } from "@/data/tower/towers-sitemap";
import { SITE_URL } from "@/utils/constants";
import { getStaticSitemapPages } from "@/utils/staticSitemapPages";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const towers = await getAllTowersForSitemap();

    // Individual tower pages
    const towerPages: MetadataRoute.Sitemap = towers.map((t) => ({
        url: `${SITE_URL}/${t.type}/${t.nameID}`,
        canonical: `${SITE_URL}/${t.type}/${t.nameID}`,
        lastModified: t.modified.toISOString(),
        changeFrequency: "weekly",
    }));

    return [...getStaticSitemapPages(), ...towerPages];
}
