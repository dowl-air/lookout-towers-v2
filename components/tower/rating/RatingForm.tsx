"use client";
import { useFormState } from "react-dom";
import { useSession } from "next-auth/react";

import { Rating, Tower } from "@/typings";
import { loginRedirect } from "@/actions/login.redirect";
import { cn } from "@/utils/cn";
import RatingModal from "@/components/tower/rating/RatingModal";
import UserRating from "@/components/tower/rating/UserRating";
import RatingStats from "@/components/tower/rating/RatingStats";

const RatingForm = ({
    tower,
    initRating,
    ratings,
    updateTowerRating,
}: {
    tower: Tower;
    initRating: Rating | null;
    ratings: Rating[];
    updateTowerRating: () => Promise<Rating | null>;
}) => {
    const [currentRating, action] = useFormState(updateTowerRating, initRating);

    const session = useSession();

    return (
        <>
            <form action={action} id="tower-rating-form" className="w-full max-w-[94vw] sm:max-w-[100vw]">
                <div className="card flex flex-col justify-center gap-8 w-full px-6 py-8 shadow-xl bg-[rgba(255,255,255,0.05)]">
                    <div className="flex justify-between items-center sm:items-start w-full">
                        <h2 className="card-title text-base sm:text-lg md:text-xl">{`Recenze [${ratings.length + (currentRating ? 1 : 0)}]`}</h2>
                        <div className="flex flex-wrap gap-3 flex-col sm:flex-row">
                            <button
                                className="btn btn-sm btn-primary sm:btn-md"
                                onClick={async (e) => {
                                    e.preventDefault();
                                    if (session.status !== "authenticated") await loginRedirect();
                                    else (document.querySelector("#tower-rating-modal") as HTMLDialogElement).showModal();
                                }}
                            >
                                {currentRating ? "Upravit moji recenzi" : "Přidat recenzi"}
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row w-full md:gap-8">
                        <div
                            className={cn("flex max-h-72 w-full flex-col gap-6 overflow-auto", {
                                "hidden md:flex": ratings.length === 0 && !currentRating,
                            })}
                        >
                            {currentRating && <UserRating key="mine" rating={currentRating} />}
                            {ratings.map((rating, idx) => (
                                <UserRating rating={rating} key={idx} />
                            ))}
                        </div>
                        <div
                            className={cn("divider w-full md:w-4 md:divider-horizontal", {
                                "hidden md:flex": ratings.length === 0 && !currentRating,
                            })}
                        />
                        <RatingStats reviews={[...ratings, ...(currentRating ? [currentRating] : [])]} />
                    </div>
                </div>
            </form>
            <RatingModal tower={tower} initRating={currentRating} />
        </>
    );
};

export default RatingForm;
