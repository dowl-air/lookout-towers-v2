import { LogOut } from "lucide-react";
import { revalidatePath } from "next/cache";
import { Suspense } from "react";

import { signOut } from "@/auth";
import NavbarSideButton from "@/components/navbar/NavbarSideButton";
import { verifyUser } from "@/data/auth";

const LogoutLinkSuspense = async () => {
    const { isAuth } = await verifyUser();
    if (!isAuth) return null;

    return (
        <li>
            <form
                action={async () => {
                    "use server";
                    await signOut();
                    revalidatePath("/");
                }}
                className="block"
            >
                <NavbarSideButton
                    type="submit"
                    className="w-full text-left text-xl flex gap-2 items-center"
                >
                    <LogOut />
                    Odhlásit se
                </NavbarSideButton>
            </form>
        </li>
    );
};

const LogoutLink = async () => {
    return (
        <Suspense fallback={null}>
            <LogoutLinkSuspense />
        </Suspense>
    );
};

export default LogoutLink;
