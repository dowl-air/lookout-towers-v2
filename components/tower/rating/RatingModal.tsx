"use client";
import { useRef, useState } from "react";

import { editRating, removeRating } from "@/actions/ratings/ratings.action";
import TowerModal from "@/components/shared/dialog/TowerModal";
import ThemedRating from "@/components/shared/ThemedRating";
import { getTowerType4 } from "@/constants/towerType";

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
        <TowerModal
            dialogRef={modalRef}
            id="tower-rating-modal"
            title={`Hodnocení ${getTowerType4(tower.type)} ${tower.name}`}
            description="Přidejte stručné hodnocení, které pomůže ostatním naplánovat návštěvu."
            showCloseAction={false}
            leadingActions={
                initRating
                    ? [
                          {
                              label: "Smazat hodnocení",
                              onClick: deleteRating,
                              className: "btn-outline btn-error",
                          },
                      ]
                    : []
            }
            actions={[
                {
                    label: "Uložit hodnocení",
                    onClick: updateRating,
                    className: "btn-primary",
                    disabled: rating <= 0,
                },
            ]}
        >
            <div className="space-y-5">
                <div className="rounded-lg border border-base-300/70 bg-base-200/35 p-4 text-center">
                    <ThemedRating
                        readonly={false}
                        value={rating}
                        size={42}
                        className="justify-center"
                        setValue={setRating}
                    />
                    <div className="mt-2 text-sm text-base-content/70">{`Vaše hodnocení: ${rating}`}</div>
                </div>
                <textarea
                    className="textarea min-h-36 w-full rounded-lg border-base-300 bg-base-100 text-base"
                    placeholder="Co se vám líbilo? Co by se dalo zlepšit? Co vás překvapilo?"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={500}
                ></textarea>
                <div className="flex justify-between text-xs text-base-content/55">
                    <span>Volitelné slovní hodnocení.</span>
                    <span>{text.length}/500</span>
                </div>
            </div>
        </TowerModal>
    );
};

export default RatingModal;
