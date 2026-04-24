import { loginRedirect } from "@/actions/login.redirect";
import {
    FavouriteButton,
    FavouriteButtonVariant,
} from "@/components/tower/top/buttons/FavouriteButton";
import { cn } from "@/utils/cn";

import { getTowerActionState } from "./towerActionState";

type TowerFavouriteActionProps = {
    towerID: string;
    revalidatePaths?: string[];
    variant?: FavouriteButtonVariant;
    className?: string;
};

async function TowerFavouriteAction({
    towerID,
    revalidatePaths,
    variant = "button",
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
                        <svg
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
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
                    </button>
                </form>
            );
        }

        return (
            <form action={loginRedirect}>
                <button
                    type="submit"
                    className={cn(
                        "btn btn-primary btn-sm sm:btn-md max-w-xs whitespace-nowrap text-sm min-[710px]:text-base md:w-full md:min-w-64",
                        className
                    )}
                >
                    Přidat do oblíbených
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
            className={className}
        />
    );
}

export default TowerFavouriteAction;
