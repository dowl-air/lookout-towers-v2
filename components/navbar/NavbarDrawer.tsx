import { House, LayoutList, Map, Users } from "lucide-react";

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
