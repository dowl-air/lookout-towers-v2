import { ListChecks } from "lucide-react";
import { Suspense } from "react";

import NavbarSideLink from "@/components/navbar/NavbarSideLink";
import { verifyUser } from "@/data/auth";

const VisitedTowersLinkSuspense = async () => {
    const { isAuth } = await verifyUser();
    if (!isAuth) return null;

    return (
        <li className="mt-5">
            <NavbarSideLink href="/navstivene">
                <ListChecks />
                Navštívené rozhledny
            </NavbarSideLink>
        </li>
    );
};

const VisitedTowersLink = async () => {
    return (
        <Suspense fallback={null}>
            <VisitedTowersLinkSuspense />
        </Suspense>
    );
};

export default VisitedTowersLink;
