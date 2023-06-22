"use client";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const Buttons = ({ towerID }: { towerID: string }) => {
    const { data: session, status } = useSession();
    const [isFavourite, setIsFavourite] = useState(false);

    const addToFavourites = async () => {
        if (status === "unauthenticated") return signIn();
        if (isFavourite) return;
        const result = await fetch(
            "/api/favourites/create?" +
                new URLSearchParams({
                    // @ts-ignore
                    user_id: session?.user?.id,
                    tower_id: towerID,
                }),
            { method: "POST" }
        ).then((res) => res.json());
        if (result.status == 201) setIsFavourite(true);
    };

    const removeFromFavourites = async () => {
        if (!isFavourite) return;
        const result = await fetch(
            "/api/favourites/delete?" +
                new URLSearchParams({
                    // @ts-ignore
                    user_id: session?.user?.id,
                    tower_id: towerID,
                }),
            { method: "POST" }
        ).then((res) => res.json());
        if (result.status == 200) setIsFavourite(false);
    };

    useEffect(() => {
        const checkFavourite = async () => {
            const result = await fetch(
                "/api/favourites/check?" +
                    new URLSearchParams({
                        // @ts-ignore
                        user_id: session?.user?.id,
                        tower_id: towerID,
                    }).toString()
            ).then((res) => res.json());
            if (result.status == 200) setIsFavourite(true);
        };
        if (status == "authenticated") checkFavourite();
        // @ts-ignore
    }, [status, session?.user?.id, towerID]);

    return (
        <>
            {isFavourite ? (
                <>
                    <div
                        className="btn btn-success max-w-xs text-xs hidden lg:inline-flex min-[710px]:text-base [&>span]:hover:hidden hover:before:content-['Odebrat_z_oblíbených'] hover:btn-warning"
                        onClick={() => removeFromFavourites()}
                    >
                        <span>V oblíbených</span>
                    </div>
                    <div className="btn max-w-xs text-xs min-[710px]:text-base btn-warning lg:hidden" onClick={() => removeFromFavourites()}>
                        <span>Odebrat z oblíbených</span>
                    </div>
                </>
            ) : (
                <div className="btn btn-primary max-w-xs text-xs min-[710px]:text-base" onClick={() => addToFavourites()}>
                    Přidat do oblíbených
                </div>
            )}
            {false ? (
                <div className="btn btn-success w-1/2 mt-3 mb-5 [&>span]:hover:hidden hover:before:content-['Upravit_návštěvu'] hover:btn-warning ">
                    <span>V navštívených</span>
                </div>
            ) : (
                <div className="btn btn-primary max-w-xs text-xs min-[710px]:text-base">Zaznamenat návštěvu</div>
            )}
        </>
    );
};

export default Buttons;
