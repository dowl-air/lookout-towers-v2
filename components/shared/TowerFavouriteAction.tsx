import { Star } from "lucide-react";

import { loginRedirect } from "@/actions/login.redirect";
import {
    FavouriteButton,
    FavouriteButtonTone,
    FavouriteButtonVariant,
} from "@/components/tower/top/buttons/FavouriteButton";
import { cn } from "@/utils/cn";

import { getTowerActionState } from "./towerActionState";

type TowerFavouriteActionProps = {
    towerID: string;
    revalidatePaths?: string[];
    variant?: FavouriteButtonVariant;
    tone?: FavouriteButtonTone;
    className?: string;
};

async function TowerFavouriteAction({
    towerID,
    revalidatePaths,
    variant = "button",
    tone = "primary",
    className,
}: TowerFavouriteActionProps) {
    const { isAuthenticated, isFavourite } = await getTowerActionState(towerID);
    const label = "Přihlaste se pro uložení do oblíbených";

    if (!isAuthenticated) {
        if (variant === "icon") {
            return (
                <form action={loginRedirect}>
                    <button
                        type="submit"
                        aria-label={label}
                        title={label}
                        className={cn(
                            "btn btn-circle btn-sm sm:btn-md border border-base-300 bg-base-100 text-base-content/70 transition-colors hover:border-amber-400 hover:bg-amber-400/10 hover:text-amber-500",
                            className
                        )}
                    >
                        <Star className="size-5" />
                    </button>
                </form>
            );
        }

        return (
            <form action={loginRedirect}>
                <button
                    type="submit"
                    className={cn(
                        "btn btn-sm sm:btn-md max-w-xs whitespace-nowrap text-sm min-[710px]:text-base md:w-full md:min-w-64",
                        tone === "outline" ? "btn-outline" : "btn-primary",
                        className
                    )}
                >
                    <Star className="size-4" />
                    <span>Do oblíbených</span>
                </button>
            </form>
        );
    }

    return (
        <FavouriteButton
            key={`${towerID}:${isFavourite ? "fav" : "not-fav"}:${variant}`}
            isFavouriteInit={isFavourite}
            towerID={towerID}
            revalidatePaths={revalidatePaths}
            variant={variant}
            tone={tone}
            className={className}
        />
    );
}

export default TowerFavouriteAction;
