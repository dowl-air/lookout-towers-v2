import { MetadataRoute } from 'next'
import { db } from './firebase'
import { Tower, TowerFirebase } from '@/typings'
import { getDocs, collection } from 'firebase/firestore';
import { normalizeTowerObject } from '@/utils/normalizeTowerObject';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

    const getAllTowers = async (): Promise<Tower[]> => {
        const towers: Tower[] = [];
        const querySnapshot = await getDocs(collection(db, "towers"));
        querySnapshot.forEach((doc) => {
            towers.push(normalizeTowerObject(doc.data() as TowerFirebase));
        });
        return towers;
    };

    const towers: Tower[] = await getAllTowers();

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
                lastModified: t.modified
            }
        })
    ]
}