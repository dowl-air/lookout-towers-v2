"use client";
import { Tower, Visit } from "@/typings";
import { signIn, useSession } from "next-auth/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
//@ts-ignore
import Datepicker from "tailwind-datepicker-react";

const Buttons = ({ tower }: { tower: Tower }) => {
    const { data: session, status } = useSession();
    const [isFavourite, setIsFavourite] = useState(false);
    const [isVisited, setIsVisited] = useState(false);
    const [existingVisit, setExistingVisit] = useState<Visit | null>(null);

    const [favLoading, setFavLoading] = useState<Boolean>(true);
    const [visitedLoading, setVisitedLoading] = useState<Boolean>(true);

    const [visitedDate, setVisitedDate] = useState<Date>(new Date());
    const [visitedText, setVisitedText] = useState<string>("");

    const [datePickShown, setDatePickShown] = useState<boolean>(false);

    const dialogRef = useRef<HTMLDialogElement>(null);

    const getDatePickerOptions = useCallback(() => {
        const datePickerOptions = {
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
        };
        return datePickerOptions;
    }, [visitedDate]);

    const addToFavourites = async () => {
        if (status === "unauthenticated") return signIn();
        if (status !== "authenticated") return;
        if (isFavourite || favLoading) return;
        setFavLoading(true);
        const result = await fetch(
            "/api/favourites/create?" +
                new URLSearchParams({
                    // @ts-ignore
                    user_id: session?.user?.id,
                    tower_id: tower.id,
                }),
            { method: "POST" }
        ).then((res) => res.json());
        if (result.status == 201) setIsFavourite(true);
        setFavLoading(false);
    };

    const updateVisited = async () => {
        if (status === "unauthenticated") return signIn();
        if (status !== "authenticated") return;
        if (visitedLoading) return;
        if (existingVisit?.date === visitedDate && existingVisit?.text === visitedText) return;
        setVisitedLoading(true);

        const result = await fetch("/api/visits/create", {
            method: "POST",
            // @ts-ignore
            body: JSON.stringify({ towerID: tower.id, userID: session?.user.id, text: visitedText, date: visitedDate }),
        }).then((res) => res.json());

        if (result.status === 201) {
            setIsVisited(true);
            setExistingVisit({
                date: visitedDate,
                id: "random",
                created: new Date(),
                text: visitedText,
                tower_id: tower.id,
                user_id: "random",
            });
        }
        setVisitedLoading(false);
    };

    const removeVisit = async (): Promise<any> => {
        setVisitedLoading(true);
        // @ts-ignore
        const result = await fetch(`/api/visits/delete?tower_id=${tower.id}&user_id=${session?.user?.id}`, { method: "POST" }).then((res) =>
            res.json()
        );
        if (result.status == 200) {
            setExistingVisit(null);
            setVisitedDate(new Date());
            setVisitedText("");
            setIsVisited(false);
        }
        setVisitedLoading(false);
    };

    const removeFromFavourites = async () => {
        if (!isFavourite || favLoading) return;
        setFavLoading(true);
        const result = await fetch(
            "/api/favourites/delete?" +
                new URLSearchParams({
                    // @ts-ignore
                    user_id: session?.user?.id,
                    tower_id: tower.id,
                }),
            { method: "POST" }
        ).then((res) => res.json());
        if (result.status == 200) setIsFavourite(false);
        setFavLoading(false);
    };

    useEffect(() => {
        const checkFavourite = async () => {
            const result = await fetch(
                "/api/favourites/check?" +
                    new URLSearchParams({
                        // @ts-ignore
                        user_id: session?.user?.id,
                        tower_id: tower.id,
                    }).toString()
            ).then((res) => res.json());
            if (result.status == 200) setIsFavourite(true);
        };
        const checkVisited = async () => {
            const result = await fetch(
                "/api/visits/get?" +
                    new URLSearchParams({
                        // @ts-ignore
                        user_id: session?.user?.id,
                        tower_id: tower.id,
                    }).toString()
            ).then((res) => res.json());
            if (result.status == 200) {
                const visit: Visit = result.message as Visit;
                visit.date = new Date(Date.parse(result.message.date));
                setIsVisited(true);
                setVisitedText(visit.text);
                setVisitedDate(visit.date);
                setExistingVisit(visit);
            }
        };
        if (status === "loading") return;
        if (status === "authenticated") {
            checkFavourite().then(() => setFavLoading(false));
            checkVisited().then(() => setVisitedLoading(false));
        } else {
            setFavLoading(false);
            setVisitedLoading(false);
        }
        // @ts-ignore
    }, [status, session?.user?.id, tower.id]);

    return (
        <>
            {isFavourite ? (
                <>
                    <div
                        className={`btn btn-success max-w-xs text-sm hidden lg:inline-flex min-[710px]:text-base w-full ${
                            !favLoading ? "[&>span]:hover:hidden hover:before:content-['Odebrat_z_oblíbených'] hover:btn-warning" : ""
                        }`}
                        onClick={() => removeFromFavourites()}
                    >
                        {favLoading ? <span className="loading loading-dots loading-lg"></span> : <span>{"V oblíbených"}</span>}
                    </div>
                    <div className="btn max-w-xs text-sm min-[710px]:text-base btn-warning lg:hidden w-full" onClick={() => removeFromFavourites()}>
                        {favLoading ? <span className="loading loading-dots loading-lg"></span> : "Odebrat z oblíbených"}
                    </div>
                </>
            ) : (
                <div className="btn btn-primary max-w-xs text-sm min-[710px]:text-base w-full" onClick={() => addToFavourites()}>
                    {favLoading ? <span className="loading loading-dots loading-lg"></span> : "Přidat do oblíbených"}
                </div>
            )}

            {isVisited ? (
                <>
                    <div
                        className={`btn btn-success max-w-xs text-sm hidden lg:inline-flex min-[710px]:text-base w-full ${
                            !visitedLoading ? "[&>span]:hover:hidden hover:before:content-['Upravit_návštěvu'] hover:btn-warning" : ""
                        }`}
                        onClick={() => dialogRef?.current?.showModal()}
                    >
                        {visitedLoading ? (
                            <span className="loading loading-dots loading-lg"></span>
                        ) : (
                            <span>{"Navštíveno " + existingVisit?.date.toLocaleDateString()}</span>
                        )}
                    </div>
                    <div
                        className="btn max-w-xs text-sm min-[710px]:text-base btn-warning lg:hidden w-full"
                        onClick={() => dialogRef?.current?.showModal()}
                    >
                        {visitedLoading ? <span className="loading loading-dots loading-lg"></span> : "Upravit návštěvu"}
                    </div>
                </>
            ) : (
                <div
                    className="btn btn-primary max-w-xs text-sm w-full min-[710px]:text-base"
                    onClick={() => {
                        status !== "authenticated" ? signIn() : dialogRef?.current?.showModal();
                    }}
                >
                    {visitedLoading ? <span className="loading loading-dots loading-lg"></span> : "Zaznamenat návštěvu"}
                </div>
            )}

            <dialog ref={dialogRef} id="visit_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box p-10">
                    <div className="flex flex-col justify-center gap-3">
                        <h3 className="font-bold text-2xl self-center">Zaznamenat návštěvu rozhledny {tower.name}</h3>

                        <textarea
                            className="textarea textarea-primary text-lg h-36 text-base-content"
                            value={visitedText}
                            maxLength={500}
                            placeholder="Popis návštěvy..."
                            onChange={(e) => setVisitedText(e.target.value)}
                        ></textarea>
                        <Datepicker
                            setShow={(state: boolean) => {
                                setDatePickShown(state);
                            }}
                            show={datePickShown}
                            options={getDatePickerOptions()}
                            onChange={(selectedDate: Date) => setVisitedDate(selectedDate)}
                        />
                    </div>
                    <div className="modal-action justify-between">
                        {existingVisit ? (
                            <button
                                className="btn btn-error"
                                onClick={() => {
                                    removeVisit();
                                    dialogRef?.current?.close();
                                }}
                            >
                                Odstranit návštěvu
                            </button>
                        ) : (
                            <div></div>
                        )}
                        <div className="flex gap-2">
                            <button className="btn btn-error hidden md:inline-flex" onClick={() => dialogRef?.current?.close()}>
                                Zavřít
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    updateVisited();
                                    dialogRef?.current?.close();
                                }}
                            >
                                Uložit
                            </button>
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
};

export default Buttons;
