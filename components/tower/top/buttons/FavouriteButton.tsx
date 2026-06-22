"use client";

import { Star } from "lucide-react";
import { useActionState, useOptimistic } from "react";

import { addToFavourites, removeFromFavourites } from "@/actions/favourites/favourites.action";
import { cn } from "@/utils/cn";

export type FavouriteButtonVariant = "button" | "icon";
export type FavouriteButtonTone = "primary" | "outline";

type FavouriteButtonProps = {
    isFavouriteInit: boolean;
    towerID: string;
    revalidatePaths?: string[];
    variant?: FavouriteButtonVariant;
    tone?: FavouriteButtonTone;
    className?: string;
};

export const FavouriteButton = ({
    isFavouriteInit,
    towerID,
    revalidatePaths,
    variant = "button",
    tone = "primary",
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
                            ? "border-primary bg-primary text-primary-content hover:border-primary hover:bg-primary/90"
                            : "border-base-300 bg-base-100 text-base-content/70 hover:border-primary hover:bg-primary/10 hover:text-primary",
                        className
                    )}
                >
                    <Star className="size-5" fill={optimisticState ? "currentColor" : "none"} />
                </button>
            </form>
        );
    }

    return (
        <form action={action}>
            <button
                type="submit"
                aria-label={actionLabel}
                title={actionLabel}
                className={cn(
                    "btn md:min-w-64 btn-sm sm:btn-md whitespace-nowrap max-w-xs text-sm md:w-full min-[710px]:text-base",
                    optimisticState
                        ? tone === "outline"
                            ? "btn-outline border-primary text-primary hover:border-primary hover:bg-primary/10 hover:text-primary"
                            : "btn-primary"
                        : tone === "outline"
                          ? "btn-outline"
                          : "btn-primary",
                    className
                )}
            >
                <Star className="size-4" fill={optimisticState ? "currentColor" : "none"} />
                <span>{optimisticState ? "V oblíbených" : "Do oblíbených"}</span>
            </button>
        </form>
    );
};
