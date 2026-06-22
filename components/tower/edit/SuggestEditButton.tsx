"use client";

import { PencilLine } from "lucide-react";
import { useRouter } from "next/navigation";

import { checkAuth } from "@/actions/checkAuth";
import { cn } from "@/utils/cn";
import { showModalWithoutFocus } from "@/utils/showModal";

type SuggestEditButtonProps = {
    className?: string;
    compact?: boolean;
    label?: string;
};

const SuggestEditButton = ({
    className,
    compact = false,
    label = "Navrhnout úpravu údajů",
}: SuggestEditButtonProps) => {
    const router = useRouter();

    const handleClick = async () => {
        if (!(await checkAuth())) {
            return router.push("/signin");
        }

        showModalWithoutFocus("suggest_edit_modal");
    };

    return (
        <button
            type="button"
            className={cn(
                compact ? "btn btn-outline btn-sm" : "btn btn-outline btn-sm sm:btn-md",
                className
            )}
            onClick={handleClick}
        >
            <PencilLine className="size-4" />
            {label}
        </button>
    );
};

export default SuggestEditButton;
