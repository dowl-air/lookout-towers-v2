import { Trophy } from "lucide-react";
import { Suspense } from "react";

import NavbarSideLink from "@/components/navbar/NavbarSideLink";
import { checkUser } from "@/data/auth";

const ProgressLinkSuspense = async () => {
    const { isAuth } = await checkUser();
    if (!isAuth) return null;

    return (
        <li>
            <NavbarSideLink href="/pokrok">
                <Trophy />
                Můj pokrok
            </NavbarSideLink>
        </li>
    );
};

const ProgressLink = async () => {
    return (
        <Suspense fallback={null}>
            <ProgressLinkSuspense />
        </Suspense>
    );
};

export default ProgressLink;
