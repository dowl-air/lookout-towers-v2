"use client";

import { useSession } from "next-auth/react";
import { type MouseEvent, useActionState } from "react";

import { loginRedirect } from "@/actions/login.redirect";
import RatingModal from "@/components/tower/rating/RatingModal";
import RatingStats from "@/components/tower/rating/RatingStats";
import UserRating from "@/components/tower/rating/UserRating";
import { Rating } from "@/types/Rating";
import { Tower } from "@/types/Tower";
import { User } from "@/types/User";
import { showModalWithoutFocus } from "@/utils/showModal";

const RatingForm = ({
    tower,
    initRating,
    ratings,
    updateTowerRating,
    users,
}: {
    tower: Tower;
    initRating: Rating | null;
    ratings: Rating[];
    updateTowerRating: () => Promise<Rating | null>;
    users: User[];
}) => {
    const [currentRating, action] = useActionState(updateTowerRating, initRating);

    const session = useSession();
    const reviews = [...ratings, ...(currentRating ? [currentRating] : [])];
    const hasReviews = reviews.length > 0;

    const handleRatingButtonClick = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (session.status !== "authenticated") await loginRedirect();
        else showModalWithoutFocus("tower-rating-modal");
    };

    return (
        <>
            <form
                action={action}
                id="tower-rating-form"
                className="w-full max-w-[94vw] sm:max-w-[100vw]"
            >
                <div className="card flex w-full flex-col justify-center gap-6 bg-[rgba(255,255,255,0.05)] px-6 py-8 shadow-xl">
                    <div className="flex gap-2 justify-between items-center sm:items-start w-full">
                        <h2 className="card-title text-base sm:text-lg md:text-xl text-nowrap">{`Hodnocení [${
                            reviews.length
                        }]`}</h2>
                        {hasReviews ? (
                            <div className="flex flex-wrap gap-3 flex-col sm:flex-row">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-primary sm:btn-md"
                                    onClick={handleRatingButtonClick}
                                >
                                    {currentRating ? "Upravit moje hodnocení" : "Přidat hodnocení"}
                                </button>
                            </div>
                        ) : null}
                    </div>
                    {hasReviews ? (
                        <div className="flex flex-col md:flex-row w-full md:gap-8">
                            <div className="flex max-h-[60dvh] w-full flex-col gap-6 overflow-auto pr-1 lg:max-h-136">
                                {currentRating && (
                                    <UserRating
                                        key="mine"
                                        rating={currentRating}
                                        user={session.data?.user}
                                    />
                                )}
                                {ratings.map((rating, idx) => (
                                    <UserRating
                                        rating={rating}
                                        key={idx}
                                        user={users.find((el) => el.id === rating.user_id)}
                                    />
                                ))}
                            </div>
                            <div className="divider w-full md:w-4 md:divider-horizontal" />
                            <RatingStats reviews={reviews} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-start justify-between gap-4 rounded-lg border border-dashed border-base-300 bg-base-200/35 px-4 py-3 sm:flex-row sm:items-center">
                            <p className="text-sm font-medium text-base-content/70">
                                Zatím zde není žádné hodnocení.
                            </p>
                            <button
                                type="button"
                                className="btn btn-sm btn-primary w-full shrink-0 sm:w-auto sm:btn-md"
                                onClick={handleRatingButtonClick}
                            >
                                Přidat hodnocení
                            </button>
                        </div>
                    )}
                </div>
            </form>
            <RatingModal tower={tower} initRating={currentRating} />
        </>
    );
};

export default RatingForm;
