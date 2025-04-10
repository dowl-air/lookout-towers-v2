import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth, signOut } from "@/auth";

const ProfileIconButton = async () => {
    const session = await auth();
    if (!session?.user) return null;

    return (
        <>
            <div className="dropdown dropdown-end w-10 h-10">
                {session.user.image ? (
                    <label tabIndex={0}>
                        <div className="avatar cursor-pointer">
                            <div className="w-10 rounded-full">
                                <Image src={session.user.image} width={40} height={40} alt={"profile picture"} referrerPolicy="no-referrer" />
                            </div>
                        </div>
                    </label>
                ) : (
                    <label tabIndex={0}>
                        <div className="avatar placeholder cursor-pointer">
                            <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                                <span>{session.user.name ? session.user.name.substring(0, 2) : "TY"}</span>
                            </div>
                        </div>
                    </label>
                )}

                <ul tabIndex={0} className="menu dropdown-content p-2 shadow-sm bg-base-100 rounded-box w-52 mt-4">
                    <li>
                        <Link href={"/navstivene"}>Navštívené rozhledny</Link>
                    </li>
                    <li>
                        <Link href={"/profil"}>Můj profil</Link>
                    </li>
                    <li>
                        <form
                            action={async () => {
                                "use server";
                                await signOut();
                                redirect("/");
                            }}
                            className="block"
                        >
                            <button type="submit" className="w-full text-left">
                                Odhlásit se
                            </button>
                        </form>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default ProfileIconButton;
