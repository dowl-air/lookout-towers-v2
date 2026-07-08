"use client";

import { useId } from "react";

import UserVisitLevels from "@/components/shared/UserVisitLevels";
import { cn } from "@/utils/cn";

type UserLevelBadgeButtonProps = {
    className?: string;
    color: string;
    name: string;
    textColor: string;
};

const UserLevelBadgeButton = ({ className, color, name, textColor }: UserLevelBadgeButtonProps) => {
    const generatedId = useId();
    const dialogId = `user-levels-${generatedId.replace(/:/g, "")}`;

    const openModal = () => {
        const dialog = document.getElementById(dialogId) as HTMLDialogElement | null;
        dialog?.showModal();
    };

    return (
        <>
            <button
                aria-haspopup="dialog"
                className={cn(
                    "badge badge-lg cursor-pointer border-0 transition hover:scale-105 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-100",
                    className
                )}
                onClick={openModal}
                style={{ backgroundColor: color, color: textColor }}
                type="button"
            >
                {name}
            </button>
            <UserVisitLevels dialogId={dialogId} />
        </>
    );
};

export default UserLevelBadgeButton;
