"use client";
import { Rating, Tower } from "@/typings";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import ThemedRating from "../../../../components/shared/ThemedRating";

const RatingModal = ({
    tower,
    existingReview,
    setMyReview,
    setLoading,
}: {
    tower: Tower;
    existingReview: Rating | null;
    setMyReview: Function;
    setLoading: Function;
}) => {
    const [rating, setRating] = useState(existingReview?.rating);
    const [text, setText] = useState(existingReview?.text);
    const { data: session, status } = useSession();

    const updateReview = async () => {
        if (status !== "authenticated") return;
        if (existingReview?.rating === rating && existingReview?.text === text) return;
        setLoading(true);

        const result = await fetch("/api/reviews/create", {
            method: "POST",
            // @ts-ignore
            body: JSON.stringify({ towerID: tower.id, userID: session?.user.id, text: text, rating: rating }),
        }).then((res) => res.json());

        if (result.status === 201) {
            setMyReview({
                created: new Date(),
                // @ts-ignore
                user_id: session?.user.id,
                tower_id: tower.id,
                // @ts-ignore
                id: `${tower.id}_${session?.user.id}`,
                ...existingReview,
                text: text,
                rating: rating,
            } as Rating);
        }
        setLoading(false);
    };

    useEffect(() => {
        setRating(existingReview?.rating || 0);
        setText(existingReview?.text || "");
    }, [existingReview?.text, existingReview?.rating]);

    return (
        <dialog id="modal_rating" className="modal modal-bottom sm:modal-middle">
            <form method="dialog" className="modal-box">
                <h3 className="font-bold text-lg text-base-content">Recenze pro {tower.name}</h3>
                <ThemedRating readonly={false} value={rating ? rating : 0} size={40} className="mt-3" setValue={setRating} />
                {rating ? (
                    <div className={"ml-1 text-primary"}>{`Vaše hodnocení: ${rating ? rating : 0}`}</div>
                ) : (
                    <div className={"ml-1 text-error"}>{`Vaše hodnocení: ${rating ? rating : 0}`}</div>
                )}
                <textarea
                    className="textarea textarea-primary text-secondary text-base w-full mt-4 min-h-[100px]"
                    placeholder="Vaše recenze..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={300}
                ></textarea>
                <div className="modal-action">
                    <button className="btn btn-error">Zavřít</button>
                    <button className="btn btn-primary" onClick={() => updateReview()}>
                        Uložit
                    </button>
                </div>
            </form>
        </dialog>
    );
};

export default RatingModal;
