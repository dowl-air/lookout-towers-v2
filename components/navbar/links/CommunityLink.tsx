import { Users } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import NavbarSideLink from "@/components/navbar/NavbarSideLink";
import { checkUser } from "@/data/auth";

type CommunityLinkVariant = "desktop" | "mobile";

const CommunityLinkContent = async ({ variant }: { variant: CommunityLinkVariant }) => {
    const { isAuth } = await checkUser();
    if (!isAuth) return null;

    if (variant === "mobile") {
        return (
            <li>
                <NavbarSideLink href="/komunita">
                    <Users />
                    Komunita
                </NavbarSideLink>
            </li>
        );
    }

    return (
        <li>
            <Link
                className="flex h-8 items-center rounded-full px-3 text-sm transition-colors hover:bg-base-200/80 active:bg-base-200/80 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-100"
                href="/komunita"
            >
                Komunita
            </Link>
        </li>
    );
};

const CommunityLink = ({ variant }: { variant: CommunityLinkVariant }) => {
    return (
        <Suspense fallback={null}>
            <CommunityLinkContent variant={variant} />
        </Suspense>
    );
};

export default CommunityLink;
