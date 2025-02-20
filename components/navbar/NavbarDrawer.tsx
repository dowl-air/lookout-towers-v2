import { redirect } from "next/navigation";

import ThemeChangerPhone from "@/components/navbar/ThemeChangerPhone";
import NavbarSideLink from "@/components/navbar/NavbarSideLink";
import NavbarSideButton from "@/components/navbar/NavbarSideButton";
import { auth, signIn, signOut } from "@/auth";

const NavbarDrawer = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();
    return (
        <div className="drawer">
            <input id="side-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content min-h-screen">{children}</div>
            <div className="drawer-side z-10">
                <label htmlFor="side-drawer" className="drawer-overlay"></label>
                <ul tabIndex={0} className="menu p-4 w-80 h-full bg-base-200">
                    <li>
                        <NavbarSideLink href="/rozhledny">Rozhledny</NavbarSideLink>
                    </li>
                    <li>
                        <NavbarSideLink href="/mapa">Mapa</NavbarSideLink>
                    </li>
                    {session?.user && (
                        <>
                            <li>
                                <NavbarSideLink href={"/navstivene"}>Navštívené rozhledny</NavbarSideLink>
                            </li>
                            <li>
                                <NavbarSideLink href="/profil">Můj profil</NavbarSideLink>
                            </li>
                        </>
                    )}

                    <ThemeChangerPhone />

                    {session?.user ? (
                        <li>
                            <form
                                action={async () => {
                                    "use server";
                                    await signOut();
                                    redirect("/");
                                }}
                                className="block"
                            >
                                <NavbarSideButton type="submit" className="w-full text-left text-xl">
                                    Odhlásit se
                                </NavbarSideButton>
                            </form>
                        </li>
                    ) : (
                        <li>
                            <form
                                action={async () => {
                                    "use server";
                                    await signIn();
                                }}
                                className="block"
                            >
                                <NavbarSideButton type="submit" className="w-full text-left">
                                    Přihlásit se
                                </NavbarSideButton>
                            </form>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default NavbarDrawer;
