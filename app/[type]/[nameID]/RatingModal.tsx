"use client";
import { Tower } from "@/typings";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { Rating } from "react-simple-star-rating";

const RatingModal = ({ tower }: { tower: Tower }) => {
    const [rating, setRating] = useState(3); //todo
    const [text, setText] = useState("");

    const { data: session, status } = useSession();
    //const colors = useThemeColors();
    const colors = {};

    const updateReview = async () => {
        const result = await fetch("/api/reviews/create", {
            method: "POST",
            // @ts-expect-error
            body: JSON.stringify({ towerID: tower.id, userID: session?.user.id, text: text, rating: rating }),
        }).then((res) => res.json());
        console.log(result);
    };

    return (
        <dialog id="modal_rating" className="modal modal-bottom sm:modal-middle">
            <form method="dialog" className="modal-box">
                <h3 className="font-bold text-lg text-base-content">Recenze pro {tower.name}</h3>
                <Rating
                    initialValue={rating}
                    emptyClassName="flex"
                    SVGclassName="inline-block"
                    size={40}
                    className="mt-3"
                    //fillColor={colors.primary}
                    //emptyColor={colors["base-content"]}
                    onClick={(value) => setRating(value)}
                />
                <textarea
                    className="textarea textarea-primary w-full mt-4"
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
