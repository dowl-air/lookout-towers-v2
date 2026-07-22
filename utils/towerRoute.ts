type TowerRouteIdentity = {
    nameID: string;
    type: string;
};

export const getCanonicalTowerPath = ({ type, nameID }: TowerRouteIdentity) => `/${type}/${nameID}`;

export const isCanonicalTowerType = (type: string, tower: TowerRouteIdentity) =>
    type === tower.type;
