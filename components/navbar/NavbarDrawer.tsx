import { House, LayoutList, Map, Users, X } from "lucide-react";

import LoginLink from "@/components/navbar/links/LoginLink";
import LogoutLink from "@/components/navbar/links/LogoutLink";
import ProfileLink from "@/components/navbar/links/ProfileLink";
import VisitedTowersLink from "@/components/navbar/links/VisitedTowersLink";
import NavbarSideLink from "@/components/navbar/NavbarSideLink";
import ThemeChangerPhone from "@/components/navbar/ThemeChangerPhone";

const NavbarDrawer = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="drawer">
            <input id="side-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col min-h-dvh">{children}</div>
            <div className="drawer-side z-10000">
                <label htmlFor="side-drawer" className="drawer-overlay"></label>
                <nav aria-label="Mobile" className="h-full w-80 bg-base-200">
                    <ul tabIndex={0} className="menu h-full p-4">
                        <li className="mb-2 flex justify-end">
                            <label
                                htmlFor="side-drawer"
                                className="btn btn-ghost gap-2 self-end focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-200"
                                aria-label="Zavřít navigaci"
                            >
                                Zavřít menu
                                <X size={18} />
                            </label>
                        </li>
                        <li>
                            <NavbarSideLink href="/">
                                <House />
                                Domů
                            </NavbarSideLink>
                        </li>
                        <li>
                            <NavbarSideLink href="/rozhledny">
                                <LayoutList />
                                Rozhledny
                            </NavbarSideLink>
                        </li>
                        <li>
                            <NavbarSideLink href="/mapa">
                                <Map />
                                Mapa
                            </NavbarSideLink>
                        </li>
                        <li>
                            <NavbarSideLink href="/komunita">
                                <Users />
                                Komunita
                            </NavbarSideLink>
                        </li>

                        <VisitedTowersLink />
                        <ProfileLink />
                        <LogoutLink />
                        <LoginLink />

                        <ThemeChangerPhone />
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default NavbarDrawer;
