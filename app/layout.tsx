import "./globals.css";
import { NextAuthProvider, NextThemeProvider } from "./providers";
import ClientLinkDrawerClose from "./ClientLinkDrawerClose";
import { ProfileClientButtonDrawer, Unsign } from "./personalisedLinks";
import ThemeChangerPhone from "./ThemeChangerPhone";

export const revalidate = 3600;

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
