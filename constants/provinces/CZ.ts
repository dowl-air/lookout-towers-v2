const PROVINCES_CZ = [
    {
        name: "Hlavní město Praha",
        shortName: "Praha",
        code: "PR",
        counties: ["Praha"],
    },
    {
        name: "Středočeský kraj",
        shortName: "Středočeský",
        code: "ST",
        counties: [
            "Benešov",
            "Beroun",
            "Kladno",
            "Kolín",
            "Kutná Hora",
            "Mělník",
            "Mladá Boleslav",
            "Nymburk",
            "Praha-východ",
            "Praha-západ",
            "Příbram",
            "Rakovník",
        ],
    },
    {
        name: "Jihočeský kraj",
        shortName: "Jihočeský",
        code: "JC",
        counties: ["České Budějovice", "Český Krumlov", "Jindřichův Hradec", "Písek", "Prachatice", "Strakonice", "Tábor"],
    },
    {
        name: "Plzeňský kraj",
        shortName: "Plzeňský",
        code: "PL",
        counties: ["Domažlice", "Klatovy", "Plzeň-jih", "Plzeň-město", "Plzeň-sever", "Rokycany", "Tachov"],
    },
    {
        name: "Karlovarský kraj",
        shortName: "Karlovarský",
        code: "KA",
        counties: ["Cheb", "Karlovy Vary", "Sokolov"],
    },
    {
        name: "Ústecký kraj",
        shortName: "Ústecký",
        code: "US",
        counties: ["Děčín", "Chomutov", "Litoměřice", "Louny", "Most", "Teplice", "Ústí nad Labem"],
    },
    {
        name: "Liberecký kraj",
        shortName: "Liberecký",
        code: "LI",
        counties: ["Česká Lípa", "Jablonec nad Nisou", "Liberec", "Semily"],
    },
    {
        name: "Královéhradecký kraj",
        shortName: "Královéhradecký",
        code: "KR",
        counties: ["Hradec Králové", "Jičín", "Náchod", "Trutnov", "Rychnov nad Kněžnou"],
    },
    {
        name: "Pardubický kraj",
        shortName: "Pardubický",
        code: "PA",
        counties: ["Chrudim", "Pardubice", "Svitavy", "Ústí nad Orlicí"],
    },
    {
        name: "Kraj Vysočina",
        shortName: "Vysočina",
        code: "VY",
        counties: ["Havlíčkův Brod", "Jihlava", "Pelhřimov", "Třebíč", "Žďár nad Sázavou"],
    },
    {
        name: "Jihomoravský kraj",
        shortName: "Jihomoravský",
        code: "JM",
        counties: ["Hodonín", "Brno-venkov", "Brno-město", "Břeclav", "Vyškov", "Znojmo", "Blansko"],
    },
    {
        name: "Olomoucký kraj",
        shortName: "Olomoucký",
        code: "OL",
        counties: ["Jeseník", "Olomouc", "Prostějov", "Přerov", "Šumperk"],
    },
    {
        name: "Zlínský kraj",
        shortName: "Zlínský",
        code: "ZL",
        counties: ["Kroměříž", "Uherské Hradiště", "Vsetín", "Zlín"],
    },
    {
        name: "Moravskoslezský kraj",
        shortName: "Moravskoslezský",
        code: "MO",
        counties: ["Bruntál", "Frýdek-Místek", "Karviná", "Nový Jičín", "Opava", "Ostrava-město"],
    },
];

export default PROVINCES_CZ;

export const COUNTIES_CZ = PROVINCES_CZ.reduce((acc, province) => {
    return [...acc, ...province.counties];
}, []);
