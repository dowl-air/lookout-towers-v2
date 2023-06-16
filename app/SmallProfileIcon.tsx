"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

function SmallProfileIcon() {
    const { data: session, status } = useSession();
    if (status === "loading") return <div></div>;
    return (
        <>
            {status === "authenticated" ? (
                <>
                    {session.user?.image ? (
                        <label tabIndex={0} htmlFor="my-drawer-3">
                            <div className="avatar cursor-pointer">
                                <div className="w-8 rounded-full">
                                    <Image src={session.user?.image} width={32} height={32} alt={"profile picture"} referrerPolicy="no-referrer" />
                                </div>
                            </div>
                        </label>
                    ) : (
                        <label tabIndex={0} htmlFor="my-drawer-3">
                            <div className="avatar placeholder cursor-pointer">
                                <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                                    <span>{session.user && session.user.name ? session.user.name.substring(0, 2) : "TY"}</span>
                                </div>
                            </div>
                        </label>
                    )}
                </>
            ) : (
                <div></div>
            )}
        </>
    );
}

export default SmallProfileIcon;
