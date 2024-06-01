const POINTS_TRESHOLDS = [10, 25, 50, 100, 250, 500, 750, 1000];
const NAMES = ["Nováček", "Průzkumník", "Nadšenec", "Dobyvatel věží", "Expert na výhledy", "Rozhlednový Mistr", "Král Rozhleden", "Rozhlednová legenda", "Rozhlednový bůh"];
const COLORS = ["#E6E6FA", "#D8BFD8", "#DDA0DD", "#DA70D6", "#BA55D3", "#9932CC", "#8A2BE2", "#9400D3", "#4B0082"];

export const getUserLevel = (points: number) => {
    for (let i = 0; i < POINTS_TRESHOLDS.length; i++) {
        if (points < POINTS_TRESHOLDS[i]) {
            return {name: NAMES[i], color: COLORS[i], level: i + 1};
        }
    }
    return {name: NAMES[NAMES.length - 1], color: COLORS[COLORS.length - 1], level: POINTS_TRESHOLDS.length + 1};
};