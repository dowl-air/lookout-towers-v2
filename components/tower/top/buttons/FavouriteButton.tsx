"use client";

import { useActionState, useOptimistic } from "react";
import { addToFavourites, removeFromFavourites } from "@/actions/favourites/favourites.action";

export const FavouriteButton = ({ isFavouriteInit, towerID }: { isFavouriteInit: boolean; towerID: string }) => {
    const toggleFavourite = async (isFavourite: boolean) => {
        update(!isFavourite);
        return !isFavourite ? await addToFavourites(towerID) : await removeFromFavourites(towerID);
    };

    const [isFav, action] = useActionState(toggleFavourite, isFavouriteInit);
    const [optimisticState, update] = useOptimistic(isFav, (_, optimistic) => optimistic);

    return (
        <form action={action} className="flex flex-col justify-center gap-2">
            <button
                type="submit"
                className={`btn min-w-64 ${
                    optimisticState
                        ? "btn-success [&>span]:hover:hidden hover:btn-warning hover:before:content-['Odebrat_z_oblíbených']"
                        : "btn-primary"
                } max-w-xs text-sm w-full min-[710px]:text-base"`}
            >
                <span>{optimisticState ? "V oblíbených" : "Přidat do oblíbených"}</span>
            </button>
        </form>
    );
};
