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
    const [myReview, setMyReview] = useState<Rating | null>(null);
    const [myReviewLoading, setMyReviewLoading] = useState<boolean>(true);

    const getMyReview = async (tower: Tower, user: User): Promise<Rating | null> => {
        const result = await fetch(`/api/reviews/get?tower_id=${tower.id}&user_id=${user.id}`).then((res) => res.json());
        if (result.status == 200) return result.message as Rating;
        return null;
    };

    const removeMyReview = async (): Promise<any> => {
        setMyReviewLoading(true);
        // @ts-ignore
        const result = await fetch(`/api/reviews/delete?tower_id=${tower.id}&user_id=${session?.user?.id}`, { method: "POST" }).then((res) =>
            res.json()
        );
        if (result.status == 200) setMyReview(null);
        return;
    };

    useEffect(() => {
        const s = async () => {
            if (!session?.user) return;
            const r = await getMyReview(tower, session.user as User);
            setMyReview(r);
            setMyReviewLoading(false);
        };
        if (status === "authenticated" && tower) {
            s();
        }
        if (status === "unauthenticated") {
            setMyReviewLoading(false);
        }
    }, [status, tower, session?.user]);

    return (
        <>
            <div
                id="rating_box"
                className="card flex flex-col justify-center gap-8 w-full max-w-[94vw] sm:max-w-[100vw] p-4 sm:p-8 shadow-xl bg-[rgba(255,255,255,0.05)]"
            >
                <div id="rating_box_top" className="flex justify-between items-center sm:items-start w-full">
                    <h2 className="card-title text-base sm:text-xl">{`Recenze [${count}]`}</h2>
                    <div className="flex flex-wrap gap-3 flex-col sm:flex-row">
                        <button
                            className={`btn ${myReview ? "btn-primary" : "btn-primary"} btn-sm sm:btn-md`}
                            onClick={() => {
                                if (status === "unauthenticated") return signIn();
                                const d: HTMLDialogElement = document.querySelector("#modal_rating")!;
                                d.showModal();
                            }}
                        >
                            {myReviewLoading ? (
                                <span className="loading loading-dots loading-lg"></span>
                            ) : myReview ? (
                                "Upravit recenzi"
                            ) : (
                                `Přidat recenzi`
                            )}
                        </button>
                        {myReview && !myReviewLoading && (
                            <button className="btn btn-error btn-sm sm:btn-md" onClick={() => removeMyReview().then(() => setMyReviewLoading(false))}>
                                Vymazat recenzi
                            </button>
                        )}
                    </div>
                </div>
                <div id="rating_box_bottom" className="flex flex-col md:flex-row w-full md:gap-8">
                    <div className={`flex max-h-72 w-full flex-col gap-6 overflow-auto ${reviews.length === 0 && !myReview && "hidden md:flex"}`}>
                        {myReview && <OneReview key="mine" review={myReview} data-superjson />}
                        {reviews
                            // @ts-ignore
                            .filter((r) => r.user_id !== session?.user?.id)
                            .map((r, idx) => (
                                <OneReview review={r} key={idx} />
                            ))}
                    </div>
                    <div className={`divider w-full md:w-4 md:divider-horizontal ${reviews.length === 0 && !myReview && "hidden md:flex"}`}></div>
                    <RatingStats
                        reviews={[
                            ...reviews
                                // @ts-ignore
                                .filter((r) => r.user_id !== session?.user?.id),
                            ...(myReview ? [myReview] : []),
                        ]}
                    />
                </div>
            </div>

            <RatingModal tower={tower} existingReview={myReview} setMyReview={setMyReview} setLoading={setMyReviewLoading} />
        </>
    );
}

export default RatingBox;
