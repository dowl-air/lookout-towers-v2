"use client";
import { removeVisit, setVisit } from "@/actions/visits/visits.action";
import { Tower, Visit } from "@/typings";
import { useRef, useState } from "react";
import DatePicker from "tailwind-datepicker-react";
import InfoIcon from "./InfoIcon";

//! there should be form with id="form-visit-button" in the parent component (like in VisitButton.tsx)

export const VisitModal = ({ initVisit, tower }: { initVisit: Visit | null; tower: Tower }) => {
    const [visitedText, setVisitedText] = useState(initVisit?.text || "");
    const [visitedDate, setVisitedDate] = useState(initVisit?.date ? new Date(initVisit.date) : new Date());
    const [visitedTime, setVisitedTime] = useState(
        initVisit
            ? `${String(new Date(initVisit.date).getHours()).padStart(2, "0")}:${String(new Date(initVisit.date).getMinutes()).padStart(2, "0")}`
            : "12:00"
    );
    const [datePickShown, setDatePickShown] = useState<boolean>(false);
    const [urls, setUrls] = useState<string[]>(initVisit?.urls?.length ? initVisit.urls : [""]);
    const ref = useRef<HTMLDialogElement>(null);

    const getVisit = () => {
        const date = new Date(visitedDate);
        const time = visitedTime.split(":");
        date.setHours(+time[0]);
        date.setMinutes(+time[1]);
        const urlsFinal = urls.filter((url) => url.length > 0);
        for (let i = 0; i < urlsFinal.length; i++) {
            if (!urlsFinal[i].startsWith("http")) urlsFinal[i] = `https://${urlsFinal[i]}`;
        }

        const visit = {
            text: visitedText,
            date: date.toISOString(),
        };
        if (urlsFinal.length > 0) visit["urls"] = urlsFinal;
        return visit;
    };

    const remove = async () => {
        await removeVisit(tower.id);
        (document.getElementById("form-visit-button") as HTMLFormElement)?.requestSubmit();
        setUrls([""]);
        setVisitedText("");
        setVisitedDate(new Date());
        setVisitedTime("12:00");
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
                    <h3 className="font-bold !text-xl !m-0">Zaznamenat návštěvu rozhledny {tower.name}</h3>
                    <input autoFocus={true} style={{ display: "none" }} />

                    <div className="flex gap-2 justify-between">
                        <div className="flex flex-col">
                            <label className="label">
                                <span className="label-text">Datum návštěvy</span>
                            </label>
                            <div className="flex gap-2">
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
                                        language: "cs",
                                        theme: {
                                            background: "!bg-base-100",
                                            todayBtn: "",
                                            clearBtn: "",
                                            icons: "!bg-base-200 !text-base-content",
                                            text: "!text-base-content",
                                            disabledText: "!text-base-content",
                                            input: "!bg-base-100 !border-primary !text-base-content !text-base",
                                            inputIcon: "",
                                            selected: "!bg-secondary !text-primary-content",
                                        },
                                    }}
                                    onChange={(selectedDate: Date) => setVisitedDate(selectedDate)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col flex-1 min-w-28">
                            <label htmlFor="time" className="label">
                                <span className="label-text text-nowrap">Čas návštěvy</span>
                            </label>
                            <div className="p-2 sm:p-1 px-2 sm:px-3 rounded-lg border border-primary ring-offset-2 focus-within:ring-2 focus-within:ring-primary">
                                <input
                                    value={visitedTime}
                                    type="time"
                                    name="time"
                                    className="bg-base-100 outline-none text-base-content text-base"
                                    onChange={(v) => {
                                        setVisitedTime(v.target.value);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="time" className="label">
                            <span className="label-text">
                                Popis návštěvy
                                <span className="ml-2">
                                    <InfoIcon tooltipText="Popis návštěvy nebude veřejně dostupný." />
                                </span>
                            </span>
                        </label>
                        <textarea
                            className="textarea textarea-primary h-36 text-sm text-base-content"
                            value={visitedText}
                            maxLength={800}
                            placeholder="Co se Vám líbilo? Jak jste se dostali na rozhlednu? S kým jste byli? Jaké bylo počasí?"
                            onChange={(e) => setVisitedText(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="" className="label">
                            <span className="label-text">
                                Moje odkazy
                                <span className="ml-2">
                                    <InfoIcon tooltipText="Odkazy nebudou veřejně dostupné." />
                                </span>
                            </span>
                        </label>
                        <div className="flex flex-col gap-2">
                            {urls.map((_, idx) => (
                                <div key={idx} className="flex">
                                    <input
                                        type="text"
                                        value={urls[idx]}
                                        placeholder="https://www.strava.com/activities/12345"
                                        className="input input-bordered input-primary text-sm w-full"
                                        onChange={(e) => {
                                            urls[idx] = e.target.value;
                                            setUrls([...urls]);
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                        {urls.length < 3 && (
                            <button
                                className="btn btn-outline btn-primary btn-sm self-start mt-2"
                                onClick={() => {
                                    setUrls([...urls, ""]);
                                }}
                            >
                                Přidat další odkaz
                            </button>
                        )}
                    </div>
                </div>
                <div className="modal-action justify-between">
                    <div className="flex gap-2 w-full">
                        {initVisit && (
                            <button className="btn btn-error" onClick={remove}>
                                Odstranit návštěvu
                            </button>
                        )}
                        <button className="btn btn-error" onClick={close}>
                            Zavřít
                        </button>
                        <button className="btn btn-primary ml-auto" onClick={update}>
                            Uložit
                        </button>
                    </div>
                </div>
            </div>
        </dialog>
    );
};
