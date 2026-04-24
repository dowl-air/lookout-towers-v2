"use client";

import { useActionState, useOptimistic } from "react";

import { addToFavourites, removeFromFavourites } from "@/actions/favourites/favourites.action";
import { cn } from "@/utils/cn";

export type FavouriteButtonVariant = "button" | "icon";

type FavouriteButtonProps = {
    isFavouriteInit: boolean;
    towerID: string;
    revalidatePaths?: string[];
    variant?: FavouriteButtonVariant;
    className?: string;
};

const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        className="size-5"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321 1.01l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.386a.562.562 0 0 1-.84.61l-4.725-2.885a.563.563 0 0 0-.586 0L6.982 20.56a.562.562 0 0 1-.84-.61l1.285-5.386a.563.563 0 0 0-.182-.557L3.04 10.405a.562.562 0 0 1 .321-1.01l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
        />
    </svg>
);

export const FavouriteButton = ({
    isFavouriteInit,
    towerID,
    revalidatePaths,
    variant = "button",
    className,
}: FavouriteButtonProps) => {
    const toggleFavourite = async (isFavourite: boolean) => {
        update(!isFavourite);
        const nextState = !isFavourite
            ? await addToFavourites(towerID, { revalidatePaths })
            : await removeFromFavourites(towerID, { revalidatePaths });

        return nextState;
    };

    const [isFav, action] = useActionState(toggleFavourite, isFavouriteInit);
    const [optimisticState, update] = useOptimistic<boolean, boolean>(
        isFav,
        (_, optimistic) => optimistic
    );

    const actionLabel = optimisticState ? "Odebrat z oblíbených" : "Přidat do oblíbených";

    if (variant === "icon") {
        return (
            <form action={action}>
                <button
                    type="submit"
                    aria-label={actionLabel}
                    title={actionLabel}
                    className={cn(
                        "btn btn-circle btn-sm sm:btn-md border transition-colors",
                        optimisticState
                            ? "border-amber-400 bg-amber-400 text-amber-950 hover:border-amber-300 hover:bg-amber-300"
                            : "border-base-300 bg-base-100 text-base-content/70 hover:border-amber-400 hover:bg-amber-400/10 hover:text-amber-500",
                        className
                    )}
                >
                    <StarIcon filled={optimisticState} />
                </button>
            </form>
        );
    }

    return (
        <form action={action}>
            <button
                type="submit"
                className={cn(
                    "btn md:min-w-64 btn-sm sm:btn-md whitespace-nowrap max-w-xs text-sm md:w-full min-[710px]:text-base",
                    optimisticState
                        ? "btn-success hover:[&>span]:hidden hover:btn-warning hover:before:content-['Odebrat_z_oblíbených']"
                        : "btn-primary",
                    className
                )}
            >
                <span>{optimisticState ? "V oblíbených" : "Přidat do oblíbených"}</span>
            </button>
        </form>
    );
};
