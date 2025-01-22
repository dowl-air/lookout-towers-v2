"use client";

import { removeVisit, setVisit } from "@/actions/visits/visits.action";
import { useRef, useState } from "react";
import DatePicker from "tailwind-datepicker-react";
import InfoIcon from "./InfoIcon";
import { Visit } from "@/types/Visit";
import { Tower } from "@/types/Tower";
import { Photo } from "@/types/Photo";
import { removePhoto } from "@/actions/photos/remove.action";
import { uploadPhoto } from "@/actions/photos/upload.action";

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
    const [photos, setPhotos] = useState<Photo[]>(initVisit?.photos || []);
    const [photosToUpload, setPhotosToUpload] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);

    const ref = useRef<HTMLDialogElement>(null);
    const fileSelectorRef = useRef<HTMLInputElement>(null);

    const removePhotos = async (): Promise<string[]> => {
        const oldPhotos = initVisit?.photos || [];
        if (oldPhotos.length === 0) return [];

        const oldPhotosIds = oldPhotos.map((photo) => photo.id);
        const photoIdsToRemove = oldPhotosIds.filter((id) => !photos.map((photo) => photo.id).includes(id));

        if (photoIdsToRemove.length > 0) {
            await Promise.all(photoIdsToRemove.map((photo) => removePhoto(photo)));
        }

        return oldPhotosIds.filter((id) => !photoIdsToRemove.includes(id));
    };

    const uploadNewPhotos = async (): Promise<string[]> => {
        if (photosToUpload.length > 0) {
            const newPhotos = await Promise.all(photosToUpload.map((photo) => uploadPhoto(photo, tower.id, false)));
            return newPhotos;
        }
        return [];
    };

    const getVisit = async () => {
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

        const ids = await removePhotos();
        const newIds = await uploadNewPhotos();
        const photoIds = [...ids, ...newIds];
        if (photoIds.length > 0) visit["photoIds"] = photoIds;

        return visit;
    };

    const remove = async () => {
        await removeVisit(tower.id);
        (document.getElementById("form-visit-button") as HTMLFormElement)?.requestSubmit();
        setUrls([""]);
        setVisitedText("");
        setVisitedDate(new Date());
        setVisitedTime("12:00");
        setPhotos([]);
        setPhotosToUpload([]);
        close();
    };

    const update = async () => {
        setLoading(true);
        await setVisit(tower.id, await getVisit());
        (document.getElementById("form-visit-button") as HTMLFormElement)?.requestSubmit();
        setLoading(false);
        close();
    };

    const close = () => {
        ref.current.close();
    };

    const handleFileInput = async () => {
        const files = fileSelectorRef.current?.files;
        const alloweUploadSize = 5 - photos.length - photosToUpload.length;
        if (files && files.length > 0 && files.length <= alloweUploadSize) {
            setPhotosToUpload([...photosToUpload, ...Array.from(files)]);
        }

        fileSelectorRef.current.value = "";
    };

    const allowAddPhoto = photos.length + photosToUpload.length < 5;

    return (
        <dialog ref={ref} id="visit_modal" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box p-10">
                <div className="flex flex-col justify-center gap-3">
                    <h3 className="font-bold !text-xl !m-0">Zaznamenat návštěvu rozhledny {tower.name}</h3>
                    <input autoFocus={true} style={{ display: "none" }} />

                    <div className="flex gap-2 justify-between">
                        <div className="flex flex-col">
                            <label className="label">
                                <span className="label-text text-nowrap">Datum návštěvy</span>
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
                                    className="bg-base-100 outline-none text-base-content text-base max-w-24 sm:max-w-32"
                                    onChange={(v) => {
                                        setVisitedTime(v.target.value);
                                    }}
                                    disabled={loading}
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
                            className="textarea textarea-primary h-36 text-sm text-base-content resize-none md:resize-y"
                            value={visitedText}
                            maxLength={1000}
                            placeholder="Co se Vám líbilo? Jak jste se dostali na rozhlednu? Co Vás překvapilo? Jaké bylo počasí?"
                            onChange={(e) => setVisitedText(e.target.value)}
                            disabled={loading}
                        ></textarea>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="" className="label" onClick={() => console.log(photosToUpload)}>
                            <span className="label-text">
                                Přidat fotky (max. 5)
                                <span className="ml-2">
                                    <InfoIcon tooltipText="Fotky nebudou veřejně dostupné." />
                                </span>
                            </span>
                        </label>
                        <div className="flex flex-col gap-2">
                            <input
                                ref={fileSelectorRef}
                                type="file"
                                className="file-input file-input-bordered file-input-primary w-full text-sm"
                                onChange={handleFileInput}
                                multiple
                                disabled={!allowAddPhoto || loading}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-3">
                            {photos.map((photo) => {
                                return (
                                    <div key={photo.url} className="relative">
                                        <img src={photo.url} className="object-cover w-full h-24 !m-0 rounded-lg" />
                                        <button
                                            className="btn btn-error btn-circle btn-xs absolute top-0.5 right-0.5"
                                            onClick={() => {
                                                setPhotos(photos.filter((p) => p !== photo));
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                );
                            })}
                            {photosToUpload.map((photo) => {
                                const url = URL.createObjectURL(photo);
                                return (
                                    <div key={url} className="relative">
                                        <img src={url} className="object-cover w-full h-24 !m-0 rounded-lg" />
                                        <button
                                            className="btn btn-error btn-circle btn-xs absolute top-0.5 right-0.5"
                                            onClick={() => {
                                                setPhotosToUpload(photosToUpload.filter((p) => p !== photo));
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="" className="label">
                            <span className="label-text">
                                Přidat odkazy
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
                                        disabled={loading}
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
                                disabled={loading}
                            >
                                Přidat další odkaz
                            </button>
                        )}
                    </div>
                </div>
                <div className="modal-action justify-between">
                    <div className="flex gap-2 w-full flex-wrap">
                        {initVisit && (
                            <button className="btn btn-error" onClick={remove} disabled={loading}>
                                Odstranit návštěvu
                            </button>
                        )}
                        <button className="btn btn-error" onClick={close} disabled={loading}>
                            Zavřít
                        </button>
                        <button className="btn btn-primary ml-auto" onClick={update}>
                            {loading ? <span className="loading loading-spinner loading-sm"></span> : "Uložit návštěvu"}
                        </button>
                    </div>
                </div>
            </div>
        </dialog>
    );
};
