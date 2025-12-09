import { Suspense } from "react";

import UserProfileAvatar from "@/components/UserProfileAvatar";
import { checkUser } from "@/data/auth";
import { getCurrentUser } from "@/data/user/user";

const NavbarUserMobileSuspense = async () => {
    const { isAuth } = await checkUser();
    if (!isAuth) return null;

    const user = await getCurrentUser();

    return (
        <label tabIndex={0} htmlFor="side-drawer">
            <UserProfileAvatar name={user.name} image={user.image} size={32} />
        </label>
    );
};

const NavbarUserMobile = () => {
    return (
        <Suspense fallback={null}>
            <NavbarUserMobileSuspense />
        </Suspense>
    );
};

export default NavbarUserMobile;
