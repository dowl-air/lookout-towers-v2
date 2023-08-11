import "./globals.css";
import { NextAuthProvider, NextThemeProvider } from "./providers";
import ClientLinkDrawerClose from "./ClientLinkDrawerClose";
import { ProfileClientButtonDrawer, Unsign } from "./personalisedLinks";
import ThemeChangerPhone from "./ThemeChangerPhone";
import { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
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
                    <NextThemeProvider>
                        <div className="drawer">
                            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                            <div className="drawer-content">{children}</div>
                            <div className="drawer-side z-10">
                                <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
                                <ul tabIndex={0} className="menu p-4 w-80 h-full bg-base-200">
                                    <li>
                                        <ClientLinkDrawerClose text="Rozhledny" href="/rozhledny" />
                                    </li>
                                    <li>
                                        <ClientLinkDrawerClose text="Mapa" href="/mapa" />
                                    </li>
                                    <li>
                                        <ClientLinkDrawerClose text="Komunita" href="/komunita" />
                                    </li>
                                    <ProfileClientButtonDrawer />
                                    <li>
                                        <Unsign />
                                    </li>

                                    <ThemeChangerPhone />
                                </ul>
                            </div>
                        </div>
                    </NextThemeProvider>
                </NextAuthProvider>
            </body>
        </html>
    );
}
