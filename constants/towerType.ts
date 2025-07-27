export enum TowerTypeEnum {
    ROZHLEDNA = "rozhledna",
    VYHLEDNA = "vyhledna",
    POZOROVATELNA = "pozorovatelna",
    MESTSKA_VEZ = "mestska_vez",
    HRADNI_VEZ = "hradni_vez",
    ZAMECKA_VEZ = "zamecka_vez",
    KOSTELNI_VEZ = "kostelni_vez",
    VODARENSKA_VEZ = "vodarenska_vez",
    VOJENSKA_VEZ = "vojenska_vez",
    PRIRODNI_VYHLIDKA = "prirodni_vyhlidka",
    ZAJIMAVOST = "zajimavost",
}

export const towerTypes: { name: string; value: TowerTypeEnum; name_4: string }[] = [
    { name: "rozhledna", value: TowerTypeEnum.ROZHLEDNA, name_4: "rozhledny" },
    { name: "výhledna", value: TowerTypeEnum.VYHLEDNA, name_4: "výhledny" },
    { name: "pozorovatelna", value: TowerTypeEnum.POZOROVATELNA, name_4: "pozorovatelny" },
    { name: "městská věž", value: TowerTypeEnum.MESTSKA_VEZ, name_4: "městské věže" },
    { name: "hradní věž", value: TowerTypeEnum.HRADNI_VEZ, name_4: "hradní věže" },
    { name: "zámecká věž", value: TowerTypeEnum.ZAMECKA_VEZ, name_4: "zámecké věže" },
    { name: "kostelní věž", value: TowerTypeEnum.KOSTELNI_VEZ, name_4: "kostelní věže" },
    { name: "vodárenská věž", value: TowerTypeEnum.VODARENSKA_VEZ, name_4: "vodárenské věže" },
    { name: "vojenská věž", value: TowerTypeEnum.VOJENSKA_VEZ, name_4: "vojenské věže" },
    { name: "přírodní vyhlídka", value: TowerTypeEnum.PRIRODNI_VYHLIDKA, name_4: "přírodní vyhlídky" },
    { name: "zajímavost", value: TowerTypeEnum.ZAJIMAVOST, name_4: "zajímavosti" },
];

export const getTowerTypeName = (type: TowerTypeEnum): string => {
    const towerType = towerTypes.find((tower) => tower.value === type);
    return towerType ? towerType.name : type;
};

export const getTowerType4 = (type: TowerTypeEnum): string => {
    const towerType = towerTypes.find((tower) => tower.value === type);
    return towerType ? towerType.name_4 : type;
};
