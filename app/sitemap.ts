import { MetadataRoute } from 'next'

import { getAllTowers } from '@/actions/towers/towers.action';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const towers = await getAllTowers();

    return [
        {
            url: 'https://www.rozhlednovysvet.cz',
            lastModified: new Date(),
        },
        {
            url: 'https://www.rozhlednovysvet.cz/rozhledny',
            lastModified: new Date(),
        },
        {
            url: 'https://www.rozhlednovysvet.cz/mapa',
            lastModified: new Date(),
        },
        ...towers.map(t => {
            return {
                url: `https://www.rozhlednovysvet.cz/${t.type}/${t.nameID}`,
                lastModified: new Date(t.modified)
            }
        })
    ]
}