const LIGHT_MODE = "autumn";
const DARK_MODE = "abyss";

export function normalizeTheme(theme?: string) {
    if (theme === "dark") {
        return DARK_MODE;
    }

    if (theme === "light") {
        return LIGHT_MODE;
    }

    return theme;
}

export { DARK_MODE, LIGHT_MODE };
