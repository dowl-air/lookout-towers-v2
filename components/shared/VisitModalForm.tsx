"use client";
import { removeVisit, setVisit } from "@/actions/visits/visits.action";
import { Tower, Visit } from "@/typings";
import { useRef, useState } from "react";
import DatePicker from "tailwind-datepicker-react";

//! there should be form with id="form-visit-button" in the parent component (like in VisitButton.tsx)

export const VisitModal = ({ initVisit, tower }: { initVisit: Visit | null; tower: Tower }) => {
    const [visitedText, setVisitedText] = useState(initVisit?.text || "");
    const [visitedDate, setVisitedDate] = useState(initVisit?.date ? new Date(initVisit.date) : new Date());
    const [datePickShown, setDatePickShown] = useState<boolean>(false);
    const ref = useRef<HTMLDialogElement>(null);

    const getVisit = () => {
        return {
            text: visitedText,
            date: visitedDate.toISOString(),
        };
    };

    const remove = async () => {
        await removeVisit(tower.id);
        (document.getElementById("form-visit-button") as HTMLFormElement)?.requestSubmit();
        close();
    };

    const update = async () => {
        await setVisit(tower.id, getVisit());
        (document.getElementById("form-visit-button") as HTMLFormElement)?.requestSubmit();
        close();
    };

    const close = () => {
        ref.current.close();
    };

    return (
        <dialog ref={ref} id="visit_modal" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box p-10">
                <div className="flex flex-col justify-center gap-3">
                    <h3 className="font-bold text-2xl self-center">Zaznamenat návštěvu rozhledny {tower.name}</h3>

                    <textarea
                        className="textarea textarea-primary text-lg h-36 text-base-content"
                        value={visitedText}
                        maxLength={800}
                        placeholder="Popis návštěvy..."
                        onChange={(e) => setVisitedText(e.target.value)}
                    ></textarea>
                    <DatePicker
                        setShow={(state: boolean) => {
                            setDatePickShown(state);
                        }}
                        show={datePickShown}
                        options={{
                            title: "Datum návštěvy",
                            autoHide: true,
                            todayBtn: false,
                            clearBtn: false,
                            minDate: new Date("1800-01-01"),
                            defaultDate: visitedDate,
                            datepickerClassNames: "top-12",
                            language: "cz",
                            theme: {
                                background: "!bg-base-100",
                                todayBtn: "",
                                clearBtn: "",
                                icons: "!bg-base-200 !text-base-content",
                                text: "!text-base-content",
                                disabledText: "!text-base-content",
                                input: "!bg-base-100 !border-primary !text-base-content !text-lg",
                                inputIcon: "",
                                selected: "!bg-secondary !text-primary-content",
                            },
                        }}
                        onChange={(selectedDate: Date) => setVisitedDate(selectedDate)}
                    />
                </div>
                <div className="modal-action justify-between">
                    {initVisit && (
                        <button className="btn btn-error" onClick={remove}>
                            Odstranit návštěvu
                        </button>
                    )}
                    <div className="flex gap-2">
                        <button className="btn btn-error hidden md:inline-flex" onClick={close}>
                            Zavřít
                        </button>
                        <button className="btn btn-primary" onClick={update}>
                            Uložit
                        </button>
                    </div>
                </div>
            </div>
        </dialog>
    );
};
