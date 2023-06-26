"use client";
import React, { useEffect, useState } from "react";
import OneReview from "./OneReview";
import RatingStats from "./RatingStats";
import { Rating, Tower } from "@/typings";
import RatingModal from "./RatingModal";
import { signIn, useSession } from "next-auth/react";
import { User } from "next-auth";

function RatingBox({ tower, count, average, reviews }: { tower: Tower; count: number; average: number; reviews: Rating[] }) {
    const { status, data: session } = useSession();
    const [reviewsActual, setReviewsActual] = useState<Rating[]>(reviews);
    const [myReview, setMyReview] = useState<Rating | null>(null);

    const getMyReview = async (tower: Tower, user: User): Promise<Rating | null> => {
        const result = await fetch(`/api/reviews/get?tower_id=${tower.id}&user_id=${user.id}`).then((res) => res.json());
        if (result.status == 200) return result.message as Rating;
        return null;
    };

    useEffect(() => {
        const s = async () => {
            if (!session?.user) return;
            const r = await getMyReview(tower, session.user as User);
            setMyReview(r);
        };
        if (status === "authenticated" && tower) s();
    }, [status, tower, session?.user]);

    return (
        <>
            <div
                id="rating_box"
                className="card flex flex-col justify-center gap-6 w-full py-5 px-3 sm:px-5 sm:p-8 shadow-xl border border-secondary-focus"
            >
                <div id="rating_box_top" className="flex justify-between items-center w-full">
                    <h2 className="card-title text-base sm:text-xl">{`Recenze [${count}]`}</h2>
                    <div className="flex flex-wrap gap-3">
                        <button
                            className={`btn ${myReview ? "btn-success" : "btn-primary"} btn-sm sm:btn-md`}
                            onClick={() => {
                                if (status === "unauthenticated") return signIn();
                                const d: HTMLDialogElement = document.querySelector("#modal_rating")!;
                                d.showModal();
                            }}
                        >
                            {myReview ? "Upravit recenzi" : `Přidat recenzi`}
                        </button>
                        {myReview && <button className="btn btn-error">Vymazat recenzi</button>}
                    </div>
                </div>
                <div id="rating_box_bottom" className="flex flex-wrap">
                    <div className="h-72 flex-col gap-6 overflow-auto min-w-[300px] flex-1">{myReview && <OneReview review={myReview} />}</div>
                    <div className="divider w-full md:w-4 md:divider-horizontal"></div>
                    <RatingStats />
                </div>
            </div>

            <RatingModal tower={tower} />
        </>
    );
}

export default RatingBox;
