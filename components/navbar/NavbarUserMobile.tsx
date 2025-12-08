import { Suspense } from "react";

import UserProfileAvatar from "@/components/UserProfileAvatar";
import { getCurrentUser } from "@/data/user/user";

const NavbarUserMobileSuspense = async () => {
    const user = await getCurrentUser();
    if (!user) return null;

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
