import { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import { NextAuthProvider, NextThemeProvider } from "./providers";

export const revalidate = 3600;

export const metadata: Metadata = {
    metadataBase: new URL("https://rozhlednovysvet.cz/"),
    title: {
        template: "%s | Rozhlednový svět",
        default: "Rozhlednový svět",
    },
    description:
        "Rozhlednový svět je komunitní databáze vyhlídkových věží, pozorovatelen a dalších objektů určených k objevování krásných výhledů. Tento web jsem vytvořil z důvodu bližšího propojení milovníků rozhleden, ke kterým samozřejmě patřím i já. Cílem tohoto webu je zmapovat všechny rozhledny v Česku (zatím), ukládat o nich aktuální informace, které budou všem volně dostupné, a v neposlední řadě umožnit uživatelům uchovat své návštěvy a vzpomínky.",
    keywords: [
        "rozhledna",
        "pozorovatelna",
        "rozhledny",
        "pozorovatelny",
        "věž",
        "věže",
        "vyhlídky",
        "vyhlídka",
        "výhledna",
        "rozhled",
        "hrad",
        "kostel",
        "zámek",
        "lookout",
        "tower",
    ],
    authors: [{ name: "Daniel Pátek", url: "https://www.facebook.com/dp9898/" }],
    creator: "Daniel Pátek",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="cs" className="font-sans" suppressHydrationWarning>
            <head />
            <body className="overflow-x-hidden">
                <NextAuthProvider>
                    <NextThemeProvider>{children}</NextThemeProvider>
                </NextAuthProvider>
                <SpeedInsights />
            </body>
        </html>
    );
}
