"use client";
import { User } from "@/typings";
import React from "react";
import { signOut } from "next-auth/react";

type ComponentProps = {
    user: User;
};

function ProfileIconButton({ user }: ComponentProps) {
    return (
        <>
            <div className="dropdown dropdown-end">
                {user?.image ? (
                    <label tabIndex={0}>
                        <div className="avatar cursor-pointer">
                            <div className="w-12 rounded-full">
                                <img src={user?.image} alt={"profile picture"} referrerPolicy="no-referrer" />
                            </div>
                        </div>
                    </label>
                ) : (
                    <label tabIndex={0}>
                        <div className="avatar placeholder cursor-pointer">
                            <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                                <span>{user && user.name ? user.name.substring(0, 2) : "TY"}</span>
                            </div>
                        </div>
                    </label>
                )}

                <ul tabIndex={0} className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                    <li onClick={() => signOut()}>
                        <a>Odhlásit se</a>
                    </li>
                </ul>
            </div>
        </>
    );
}

export default ProfileIconButton;
