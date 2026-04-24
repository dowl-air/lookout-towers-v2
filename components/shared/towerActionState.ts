import "server-only";

import { cache } from "react";

import { auth } from "@/auth";
import { checkFavourite } from "@/data/user/user-favourites";
import { getVisit } from "@/data/user/user-visits";

export const getTowerActionState = cache(async (towerID: string) => {
    const session = await auth();

    if (!session?.user) {
        return {
            isAuthenticated: false,
            isFavourite: false,
            visit: null,
        };
    }

    const [isFavourite, visit] = await Promise.all([checkFavourite(towerID), getVisit(towerID)]);

    return {
        isAuthenticated: true,
        isFavourite,
        visit,
    };
});
