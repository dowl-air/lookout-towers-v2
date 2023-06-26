"use client";
import { getThemeColors } from "@/utils/getThemeColors";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { Rating } from "react-simple-star-rating";

function ThemedRating({
    value,
    size,
    iconsCount = 5,
    className = "",
    setValue = () => {},
    readonly = true,
}: {
    value: number;
    size: number;
    iconsCount?: number;
    className?: string;
    setValue?: Function;
    readonly?: boolean;
}) {
    const [colors, setColors] = useState(undefined);
    const { theme } = useTheme();

    useEffect(() => {
        if (theme) setColors(getThemeColors(theme));
    }, [theme]);

    if (!colors)
        return (
            <span
                style={{
                    width: `${size * iconsCount}px`,
                    height: `${size}px`,
                    display: "block",
                }}
                className={className}
            ></span>
        );

    return (
        <Rating
            readonly={readonly}
            allowFraction
            initialValue={value}
            emptyClassName="flex"
            SVGclassName="inline-block"
            fillColor={colors["primary"]}
            emptyColor={colors["primary-content"]}
            size={size}
            className={className}
            iconsCount={iconsCount}
            onClick={(value) => {
                setValue(value);
            }}
        />
    );
}

export default ThemedRating;
