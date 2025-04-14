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
            <div className="drawer-content flex flex-col min-h-dvh">{children}</div>
            <div className="drawer-side z-10">
                <label htmlFor="side-drawer" className="drawer-overlay"></label>
                <ul tabIndex={0} className="menu p-4 w-80 h-full bg-base-200">
                    <li>
                        <NavbarSideLink href="/">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                                <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            </svg>
                            Domů
                        </NavbarSideLink>
                    </li>
                    <li>
                        <NavbarSideLink href="/rozhledny">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect width="7" height="7" x="3" y="3" rx="1" />
                                <rect width="7" height="7" x="3" y="14" rx="1" />
                                <path d="M14 4h7" />
                                <path d="M14 9h7" />
                                <path d="M14 15h7" />
                                <path d="M14 20h7" />
                            </svg>
                            Rozhledny
                        </NavbarSideLink>
                    </li>
                    <li>
                        <NavbarSideLink href="/mapa">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
                                <path d="M15 5.764v15" />
                                <path d="M9 3.236v15" />
                            </svg>
                            Mapa
                        </NavbarSideLink>
                    </li>
                    {session?.user && (
                        <>
                            <li className="mt-5">
                                <NavbarSideLink href="/navstivene">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="m3 17 2 2 4-4" />
                                        <path d="m3 7 2 2 4-4" />
                                        <path d="M13 6h8" />
                                        <path d="M13 12h8" />
                                        <path d="M13 18h8" />
                                    </svg>
                                    Navštívené rozhledny
                                </NavbarSideLink>
                            </li>
                            <li>
                                <NavbarSideLink href="/profil">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="10" cy="7" r="4" />
                                        <path d="M10.3 15H7a4 4 0 0 0-4 4v2" />
                                        <circle cx="17" cy="17" r="3" />
                                        <path d="m21 21-1.9-1.9" />
                                    </svg>
                                    Můj profil
                                </NavbarSideLink>
                            </li>
                        </>
                    )}

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
                                <NavbarSideButton type="submit" className="w-full text-left text-xl flex gap-2 items-center">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <polyline points="16 17 21 12 16 7" />
                                        <line x1="21" x2="9" y1="12" y2="12" />
                                    </svg>
                                    Odhlásit se
                                </NavbarSideButton>
                            </form>
                        </li>
                    ) : (
                        <li className="mt-5">
                            <form
                                action={async () => {
                                    "use server";
                                    await signIn();
                                }}
                                className="block"
                            >
                                <NavbarSideButton type="submit" className="w-full text-left text-xl flex gap-2 items-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    Přihlásit se
                                </NavbarSideButton>
                            </form>
                        </li>
                    )}
                    <ThemeChangerPhone />
                </ul>
            </div>
        </div>
    );
};

export default NavbarDrawer;
