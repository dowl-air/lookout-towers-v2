"use client";
import React from "react";
import OneReview from "./OneReview";
import RatingStats from "./RatingStats";
import { Tower } from "@/typings";
import RatingModal from "./RatingModal";
import { signIn, useSession } from "next-auth/react";

function RatingBox({ tower }: { tower: Tower }) {
    const { status } = useSession();
    return (
        <>
            <div
                id="rating_box"
                className="card flex flex-col justify-center gap-6 w-full py-5 px-3 sm:px-5 sm:p-8 shadow-xl border border-secondary-focus"
            >
                <div id="rating_box_top" className="flex justify-between items-center w-full">
                    <h2 className="card-title text-base sm:text-xl">Recenze [3]</h2>
                    <button
                        className="btn btn-primary btn-sm sm:btn-md"
                        onClick={() => {
                            if (status === "unauthenticated") return signIn();
                            const d: HTMLDialogElement = document.querySelector("#modal_rating")!;
                            d.showModal();
                        }}
                    >
                        Přidat recenzi
                    </button>
                </div>
                <div id="rating_box_bottom" className="flex flex-wrap">
                    <div className="h-72 flex-col gap-6 overflow-auto min-w-[300px] flex-1">
                        <OneReview />
                        <OneReview />
                        <OneReview />
                    </div>
                    <div className="divider w-full md:w-4 md:divider-horizontal"></div>
                    <RatingStats />
                </div>
            </div>

            <RatingModal tower={tower} />
        </>
    );
}

export default RatingBox;
