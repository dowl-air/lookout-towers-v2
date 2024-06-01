import { auth } from "@/auth";
import Image from "next/image";

const NavbarUserMobile = async () => {
    const session = await auth();
    if (!session?.user) return null;

    return (
        <>
            {session.user?.image ? (
                <label tabIndex={0} htmlFor="side-drawer">
                    <div className="avatar cursor-pointer">
                        <div className="w-8 rounded-full">
                            <Image src={session.user?.image} width={32} height={32} alt={"profile picture"} referrerPolicy="no-referrer" />
                        </div>
                    </div>
                </label>
            ) : (
                <label tabIndex={0} htmlFor="side-drawer">
                    <div className="avatar placeholder cursor-pointer">
                        <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                            <span>{session.user && session.user.name ? session.user.name.substring(0, 2) : "TY"}</span>
                        </div>
                    </div>
                </label>
            )}
        </>
    );
};

export default NavbarUserMobile;
