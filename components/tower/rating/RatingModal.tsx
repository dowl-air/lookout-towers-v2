"use client";
import { useRef, useState } from "react";

import ThemedRating from "@/components/shared/ThemedRating";
import { editRating, removeRating } from "@/actions/ratings/ratings.action";

const RatingModal = ({ tower, initRating }) => {
    const [rating, setRating] = useState(initRating?.rating ?? 0);
    const [text, setText] = useState(initRating?.text ?? "");
    const modalRef = useRef<HTMLDialogElement>(null);

    const updateRating = async () => {
        if (initRating?.rating === rating && initRating?.text === text) return;
        await editRating(tower.id, rating, text);
        (document.getElementById("tower-rating-form") as HTMLFormElement)?.requestSubmit();
        modalRef.current?.close();
    };

    const deleteRating = async () => {
        await removeRating(tower.id);
        (document.getElementById("tower-rating-form") as HTMLFormElement)?.requestSubmit();
        setRating(0);
        setText("");
        modalRef.current?.close();
    };

    return (
        <dialog ref={modalRef} id="tower-rating-modal" className="modal modal-bottom sm:modal-middle">
            <form method="dialog" className="modal-box">
                <h3 className="font-bold text-lg text-base-content">Hodnocení pro {tower.name}</h3>
                <ThemedRating readonly={false} value={rating} size={40} className="mt-3" setValue={setRating} />
                <div className={`ml-1 ${rating > 0 ? "text-primary" : "text-error"} text-primary`}>{`Vaše hodnocení: ${rating}`}</div>
                <textarea
                    className="textarea textarea-primary text-secondary text-base w-full mt-4 min-h-[100px]"
                    placeholder="Co se vám líbilo? Co by se dalo zlepšit? Co vás překvapilo?"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={500}
                ></textarea>
                <div className="modal-action">
                    {initRating && (
                        <button className="btn btn-error justify-self-start" onClick={deleteRating}>
                            Smazat hodnocení
                        </button>
                    )}
                    <button className="btn btn-error">Zavřít</button>

                    <button className="btn btn-primary" onClick={updateRating}>
                        Uložit
                    </button>
                </div>
            </form>
        </dialog>
    );
};

export default RatingModal;
