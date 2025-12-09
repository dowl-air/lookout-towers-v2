import { UserRoundSearch } from "lucide-react";
import { Suspense } from "react";

import NavbarSideLink from "@/components/navbar/NavbarSideLink";
import { checkUser } from "@/data/auth";

const ProfileLinkSuspense = async () => {
    const { isAuth } = await checkUser();
    if (!isAuth) return null;

    return (
        <li>
            <NavbarSideLink href="/profil">
                <UserRoundSearch />
                Můj profil
            </NavbarSideLink>
        </li>
    );
};

const ProfileLink = async () => {
    return (
        <Suspense fallback={null}>
            <ProfileLinkSuspense />
        </Suspense>
    );
};

export default ProfileLink;
