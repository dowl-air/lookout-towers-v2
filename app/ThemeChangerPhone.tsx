"use client";
import { closeDrawer } from "@/utils/closeDrawer";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const LIGHT_MODE = "garden";
const DARK_MODE = "forest";

function ThemeChangerPhone() {
    const { theme, setTheme } = useTheme();
    const [currentTheme, setCurrentTheme] = useState(LIGHT_MODE);

    const toggleTheme = () => {
        setTheme(theme === DARK_MODE ? LIGHT_MODE : DARK_MODE);
    };

    useEffect(() => {
        setCurrentTheme(theme || "");
    }, [theme]);

    return (
        <li
            onClick={() => {
                toggleTheme();
                closeDrawer();
            }}
        >
            {currentTheme === LIGHT_MODE ? <div>Tmavý režim</div> : <div>Světlý režim</div>}
        </li>
    );
}

export default ThemeChangerPhone;
