const colorNames = require("daisyui/src/theming/themes")

export const getThemeColors = (theme: string | undefined) : any => {
    const name = `[data-theme=${theme || "light"}]`;
    return colorNames[name];
}