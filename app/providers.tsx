"use client";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

type Props = {
    children?: React.ReactNode;
};

export const NextAuthProvider = ({ children }: Props) => {
    return <SessionProvider>{children}</SessionProvider>;
};

export const NextThemeProvider = ({ children }: Props) => {
    return (
        <ThemeProvider defaultTheme="light" enableColorScheme={false}>
            {children}
        </ThemeProvider>
    );
};
