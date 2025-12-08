import { Suspense } from "react";

import { signIn } from "@/auth";
import ProfileIconButton from "@/components/navbar/ProfileIconButton";
import { verifyUser } from "@/data/auth";

const NavbarUserSuspense = async () => {
    const { isAuth } = await verifyUser();

    if (isAuth) {
        return <ProfileIconButton />;
    } else {
        return (
            <form
                action={async () => {
                    "use server";
                    await signIn();
                }}
            >
                <button type="submit" className="btn btn-sm btn-primary ml-3 md:btn-md">
                    Přihlásit se
                </button>
            </form>
        );
    }
};

const NavbarUser = () => {
    return (
        <Suspense fallback={null}>
            <NavbarUserSuspense />
        </Suspense>
    );
};

export default NavbarUser;
