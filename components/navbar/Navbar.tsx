import Link from "next/link";
import Image from "next/image";

import NavbarUserMobile from "@/components/navbar/NavbarUserMobile";
import NavbarUserDesktop from "@/components/navbar/NavbarUserDesktop";
import ThemeChanger from "@/components/navbar/ThemeChanger";

function Navbar() {
    return (
        <div className="border-b border-base-300 w-full sticky top-0 z-10 backdrop-blur-md bg-base-100 bg-opacity-70 border-opacity-60">
            <div className="navbar max-w-7xl mx-auto px-3">
                <div className="navbar-start max-[350px]:w-auto">
                    <div className="dropdown">
                        <label tabIndex={0} htmlFor="side-drawer" className="btn btn-ghost md:hidden flex flex-nowrap gap-1 p-0 min-[320px]:px-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                            <NavbarUserMobile />
                        </label>
                    </div>
                    <Link
                        href="/"
                        className="flex items-center text-nowrap tracking-tight md:tracking-tighter gap-3 font-semibold text-base min-[450px]:text-xl lg:text-2xl md:ml-[-0.5rem]"
                    >
                        <Image src="/img/logo.png" alt="Rozhlednový svět" width={494} height={505} className="w-12 h-12 hidden md:block" />
                        Rozhlednový svět
                    </Link>
                </div>

                <div className="navbar-center hidden md:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li>
                            <Link className="active:bg-secondary" href="/rozhledny">
                                Rozhledny
                            </Link>
                        </li>
                        <li>
                            <Link className="active:bg-secondary" href="/mapa">
                                Mapa
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="navbar-end items-center gap-3 hidden md:flex">
                    <ThemeChanger />
                    <NavbarUserDesktop />
                </div>
            </div>
        </div>
    );
}

export default Navbar;
