import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

import "./globals.css";

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
    robots: "index, follow",
    openGraph: {
        type: "website",
        images: [
            {
                url: "https://rozhlednovysvet.cz/img/logo.png",
                width: 518,
                height: 517,
                alt: "Rozhlednový svět - logo",
            },
        ],
        locale: "cs_CZ",
        siteName: "Rozhlednový svět",
        url: "https://rozhlednovysvet.cz/",
    },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="cs" className="font-sans" suppressHydrationWarning>
            <head>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta name="theme-color" content="#ffffff" />
                <meta name="seznam-wmt" content="CKyPJUbUK3WkiuaBcKGOztaUfvLm9uGX" />
            </head>
            <body className="overflow-x-hidden">
                <SessionProvider>
                    <ThemeProvider enableSystem={false} defaultTheme="light">
                        {children}
                    </ThemeProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
