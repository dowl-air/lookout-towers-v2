import "./globals.css";
import ThemeChanger from "./ThemeChanger";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="cs" className="font-sans">
            <head />
            <body>
                <div className="navbar bg-base-100 max-w-screen-xl m-auto mt-3">
                    <div className="navbar-start">
                        <div className="dropdown">
                            <label tabIndex={0} className="btn btn-ghost md:hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                                </svg>
                            </label>
                            <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                                <li>
                                    <a>Rozhledny</a>
                                </li>
                                {/* <li tabIndex={0}>
                                    <a className="justify-between">
                                        Parent
                                        <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                                        </svg>
                                    </a>
                                    <ul className="p-2">
                                        <li>
                                            <a>Submenu 1</a>
                                        </li>
                                        <li>
                                            <a>Submenu 2</a>
                                        </li>
                                    </ul>
                                </li> */}
                                <li>
                                    <a>Mapa</a>
                                </li>
                                <li>
                                    <a>Komunita</a>
                                </li>
                            </ul>
                        </div>
                        <a className="btn btn-ghost normal-case text-lg md:text-xl lg:text-2xl">ROZHLEDNOVÝ SVĚT</a>
                    </div>
                    <div className="navbar-center hidden md:flex">
                        <ul className="menu menu-horizontal px-1">
                            <li>
                                <a>Rozhledny</a>
                            </li>
                            <li>
                                <a>Mapa</a>
                            </li>
                            <li>
                                <a>Komunita</a>
                            </li>
                        </ul>
                    </div>
                    <div className="navbar-end">
                        <ThemeChanger />
                        <a className="btn btn-sm btn-secondary ml-3 md:btn-md">Přihlášení</a>
                    </div>
                </div>
                {children}
            </body>
        </html>
    );
}
