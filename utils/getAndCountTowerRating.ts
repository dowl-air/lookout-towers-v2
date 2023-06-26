

export default async function getAndCountTowerRating(towerID: string) : Promise<{count: number, average: number, ratings: any[]}> {
    const ratings : any[] = await fetch(`/api/reviews/get?tower_id=${towerID}`).then(res => res.json());
    const numbers = ratings.map(r => r.rating);
    return {
        count: ratings.length,
        average: ratings.length ? (numbers.reduce((a,b) => (a + b)) / ratings.length) : 0,
        ratings: ratings
    }
}