export type UserLevelDefinition = {
    color: string;
    name: string;
    requiredVisits: number;
    textColor: string;
};

export const USER_LEVELS: UserLevelDefinition[] = [
    { color: "#DDEBDF", name: "Nováček", requiredVisits: 1, textColor: "#16351F" },
    { color: "#C9E7D2", name: "Výletník", requiredVisits: 3, textColor: "#174527" },
    {
        color: "#B8DFD7",
        name: "Začínající průzkumník",
        requiredVisits: 5,
        textColor: "#123D38",
    },
    { color: "#A7D8E8", name: "Průzkumník", requiredVisits: 10, textColor: "#123B4B" },
    { color: "#B8D2F0", name: "Cestovatel", requiredVisits: 15, textColor: "#16375C" },
    { color: "#D6C7F2", name: "Nadšenec", requiredVisits: 20, textColor: "#38265D" },
    { color: "#F0C6DD", name: "Objevitel", requiredVisits: 30, textColor: "#5A243B" },
    { color: "#F4C7B5", name: "Vyhlídkář", requiredVisits: 40, textColor: "#60301F" },
    { color: "#F2D18B", name: "Dobrodruh", requiredVisits: 50, textColor: "#4F3507" },
    { color: "#C9D96A", name: "Znalec rozhleden", requiredVisits: 75, textColor: "#303C07" },
    { color: "#7AC08F", name: "Expert na výhledy", requiredVisits: 100, textColor: "#11381E" },
    {
        color: "#3E9C8A",
        name: "Rozhlednový veterán",
        requiredVisits: 150,
        textColor: "#FFFFFF",
    },
    { color: "#2F7DA4", name: "Lovec rozhleden", requiredVisits: 200, textColor: "#FFFFFF" },
    {
        color: "#4666B0",
        name: "Rozhlednový mistr",
        requiredVisits: 250,
        textColor: "#FFFFFF",
    },
    {
        color: "#6D4BA8",
        name: "Strážce výhledů",
        requiredVisits: 350,
        textColor: "#FFFFFF",
    },
    {
        color: "#8C3F78",
        name: "Velmistr rozhleden",
        requiredVisits: 500,
        textColor: "#FFFFFF",
    },
    {
        color: "#9D3F47",
        name: "Rozhlednová legenda",
        requiredVisits: 750,
        textColor: "#FFFFFF",
    },
    {
        color: "#6F4F2A",
        name: "Vládce rozhleden",
        requiredVisits: 1000,
        textColor: "#FFFFFF",
    },
];

export const POINTS_TRESHOLDS = USER_LEVELS.map((level) => level.requiredVisits);
export const POINTS_THRESHOLDS = POINTS_TRESHOLDS;

const getVisitCount = (visits: number): number => Math.max(0, Math.floor(visits));

export const getUserLevel = (visits: number) => {
    const visitCount = getVisitCount(visits);
    let currentLevelIndex = 0;

    for (let index = 0; index < USER_LEVELS.length; index++) {
        if (visitCount >= USER_LEVELS[index].requiredVisits) {
            currentLevelIndex = index;
        }
    }

    const currentLevel = USER_LEVELS[currentLevelIndex];
    const nextLevel = USER_LEVELS[currentLevelIndex + 1] ?? null;
    const nextLevelVisits = nextLevel?.requiredVisits ?? currentLevel.requiredVisits;

    return {
        color: currentLevel.color,
        level: currentLevelIndex + 1,
        name: currentLevel.name,
        nextLevel,
        nextLevelVisits,
        progressPercent: nextLevel
            ? Math.min(100, Math.round((visitCount / nextLevel.requiredVisits) * 100))
            : 100,
        remainingVisits: nextLevel ? Math.max(0, nextLevel.requiredVisits - visitCount) : 0,
        requiredVisits: currentLevel.requiredVisits,
        textColor: currentLevel.textColor,
        visits: visitCount,
    };
};
