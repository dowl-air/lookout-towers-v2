"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { removePhoto } from "@/actions/photos/remove.action";
import { uploadPhoto } from "@/actions/photos/upload.action";
import { removeVisit, setVisit } from "@/actions/visits/visits.action";
import { Photo } from "@/types/Photo";
import { Tower } from "@/types/Tower";
import { Visit } from "@/types/Visit";

const MAX_VISIT_PHOTOS = 5;
const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_VISIT_LINKS = 3;

function toDateInputValue(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatFileSize(size: number) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function normalizeUrl(value: string) {
    const trimmed = value.trim();

    if (!trimmed) {
        return "";
    }

    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function isValidVisitUrl(value: string) {
    try {
        const url = new URL(value);

        return (
            ["http:", "https:"].includes(url.protocol) &&
            (url.hostname === "localhost" || url.hostname.includes("."))
        );
    } catch {
        return false;
    }
}

type VisitModalProps = {
    initVisit: Visit | null;
    tower: Tower;
    revalidatePaths?: string[];
    isOpen: boolean;
    onCloseAction: () => void;
    onVisitSavedAction: () => void;
};

export const VisitModal = ({
    initVisit,
    tower,
    revalidatePaths,
    isOpen,
    onCloseAction,
    onVisitSavedAction,
}: VisitModalProps) => {
    const [visitedText, setVisitedText] = useState(initVisit?.text || "");
    const [visitedDate, setVisitedDate] = useState(
        toDateInputValue(initVisit?.date ? new Date(initVisit.date) : new Date())
    );
    const [visitedTime, setVisitedTime] = useState(
        initVisit
            ? `${String(new Date(initVisit.date).getHours()).padStart(2, "0")}:${String(new Date(initVisit.date).getMinutes()).padStart(2, "0")}`
            : "12:00"
    );
    const [urls, setUrls] = useState<string[]>(initVisit?.urls?.length ? initVisit.urls : [""]);
    const [photos, setPhotos] = useState<Photo[]>(initVisit?.photos || []);
    const [photosToUpload, setPhotosToUpload] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [fileError, setFileError] = useState<string | null>(null);
    const [photoPreviewUrls, setPhotoPreviewUrls] = useState<Record<string, string>>({});

    const ref = useRef<HTMLDialogElement>(null);
    const fileSelectorRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setVisitedText(initVisit?.text || "");
        setVisitedDate(toDateInputValue(initVisit?.date ? new Date(initVisit.date) : new Date()));
        setVisitedTime(
            initVisit
                ? `${String(new Date(initVisit.date).getHours()).padStart(2, "0")}:${String(new Date(initVisit.date).getMinutes()).padStart(2, "0")}`
                : "12:00"
        );
        setUrls(initVisit?.urls?.length ? initVisit.urls : [""]);
        setPhotos(initVisit?.photos || []);
        setPhotosToUpload([]);
        setLoading(false);
        setValidationErrors([]);
        setFileError(null);
    }, [initVisit, isOpen]);

    useEffect(() => {
        const dialog = ref.current;

        if (!dialog) {
            return;
        }

        if (isOpen && !dialog.open) {
            dialog.showModal();
        }

        if (!isOpen && dialog.open) {
            dialog.close();
        }
    }, [isOpen]);

    useEffect(() => {
        const previews = Object.fromEntries(
            photosToUpload.map((photo) => [
                `${photo.name}-${photo.lastModified}`,
                URL.createObjectURL(photo),
            ])
        );

        setPhotoPreviewUrls(previews);

        return () => {
            Object.values(previews).forEach((url) => URL.revokeObjectURL(url));
        };
    }, [photosToUpload]);

    const removePhotos = async (): Promise<string[]> => {
        const oldPhotos = initVisit?.photos || [];
        if (oldPhotos.length === 0) {
            return [];
        }

        const oldPhotosIds = oldPhotos.map((photo) => photo.id);
        const photoIdsToRemove = oldPhotosIds.filter(
            (id) => !photos.map((photo) => photo.id).includes(id)
        );

        if (photoIdsToRemove.length > 0) {
            await Promise.all(photoIdsToRemove.map((photo) => removePhoto(photo)));
        }

        return oldPhotosIds.filter((id) => !photoIdsToRemove.includes(id));
    };

    const uploadNewPhotos = async (): Promise<string[]> => {
        if (photosToUpload.length === 0) {
            return [];
        }

        return Promise.all(
            photosToUpload.map((photo) => uploadPhoto(photo, tower.id, false, false, null, false))
        );
    };

    const validateForm = () => {
        const errors: string[] = [];

        if (!visitedDate) {
            errors.push("Vyberte datum návštěvy.");
        }

        if (!visitedTime) {
            errors.push("Vyberte čas návštěvy.");
        }

        if (visitedDate) {
            const selectedDate = new Date(`${visitedDate}T${visitedTime || "00:00"}`);

            if (Number.isNaN(selectedDate.getTime())) {
                errors.push("Datum nebo čas návštěvy není platný.");
            } else if (selectedDate > new Date()) {
                errors.push("Návštěvu nelze uložit do budoucnosti.");
            }
        }

        const invalidUrls = urls
            .map((url) => normalizeUrl(url))
            .filter(Boolean)
            .filter((url) => !isValidVisitUrl(url));

        if (invalidUrls.length > 0) {
            errors.push("Zkontrolujte zadané odkazy. Alespoň jeden z nich není platný.");
        }

        if (photos.length + photosToUpload.length > MAX_VISIT_PHOTOS) {
            errors.push(`Můžete uložit maximálně ${MAX_VISIT_PHOTOS} fotografií.`);
        }

        if (photosToUpload.some((photo) => photo.size > MAX_PHOTO_SIZE_BYTES)) {
            errors.push("Každá nová fotografie musí mít méně než 5 MB.");
        }

        setValidationErrors(errors);
        return errors.length === 0;
    };

    const buildVisitPayload = async () => {
        const date = new Date(`${visitedDate}T00:00`);
        const [hours, minutes] = visitedTime.split(":");
        date.setHours(Number(hours));
        date.setMinutes(Number(minutes));

        const normalizedUrls = urls.map((url) => normalizeUrl(url)).filter(Boolean);
        const visit = {
            text: visitedText.trim(),
            date: date.toISOString(),
        } as Omit<Visit, "created" | "user_id" | "tower_id">;

        if (normalizedUrls.length > 0) {
            visit.urls = normalizedUrls;
        }

        const existingPhotoIds = await removePhotos();
        const newPhotoIds = await uploadNewPhotos();
        const photoIds = [...existingPhotoIds, ...newPhotoIds];

        if (photoIds.length > 0) {
            visit.photoIds = photoIds;
        }

        return visit;
    };

    const remove = async () => {
        setLoading(true);
        await removeVisit(tower.id, { revalidatePaths });
        onVisitSavedAction();
        setLoading(false);
        ref.current?.close();
    };

    const update = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        await setVisit(tower.id, await buildVisitPayload(), { revalidatePaths });
        onVisitSavedAction();
        setLoading(false);
        ref.current?.close();
    };

    const handleFileInput = () => {
        const files = fileSelectorRef.current?.files;

        if (!files || files.length === 0) {
            fileSelectorRef.current.value = "";
            return;
        }

        const selectedFiles = Array.from(files);
        const allowedUploadCount = MAX_VISIT_PHOTOS - photos.length - photosToUpload.length;

        if (selectedFiles.length > allowedUploadCount) {
            setFileError(`Můžete přidat už jen ${allowedUploadCount} dalších fotografií.`);
            fileSelectorRef.current.value = "";
            return;
        }

        if (selectedFiles.some((file) => file.size > MAX_PHOTO_SIZE_BYTES)) {
            setFileError("Každá nová fotografie musí mít méně než 5 MB.");
            fileSelectorRef.current.value = "";
            return;
        }

        setFileError(null);
        setPhotosToUpload([...photosToUpload, ...selectedFiles]);
        fileSelectorRef.current.value = "";
    };

    const allowAddPhoto = photos.length + photosToUpload.length < MAX_VISIT_PHOTOS;
    const maxDate = toDateInputValue(new Date());

    return (
        <dialog ref={ref} className="modal modal-bottom sm:modal-middle" onClose={onCloseAction}>
            <div className="modal-box max-w-3xl rounded-4xl border border-base-300/70 bg-base-100 px-5 py-6 shadow-2xl sm:px-8 sm:py-8">
                <div className="flex flex-col gap-6">
                    <div className="space-y-2">
                        <h3 className="m-0! text-2xl font-bold leading-tight text-base-content">
                            Zaznamenat návštěvu rozhledny {tower.name}
                        </h3>
                        <p className="text-sm text-base-content/65">
                            Uložte si datum, dojmy, fotky a soukromé odkazy k návštěvě. Tyto údaje
                            uvidíte jen vy.
                        </p>
                    </div>

                    {validationErrors.length > 0 ? (
                        <div className="rounded-2xl border border-error/25 bg-error/8 px-4 py-3 text-sm text-error">
                            <p className="font-semibold">Před uložením opravte následující:</p>
                            <ul className="mt-2 list-disc pl-5">
                                {validationErrors.map((error) => (
                                    <li key={error}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    ) : null}

                    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(10rem,11rem)]">
                        <div className="space-y-2">
                            <label
                                htmlFor="visit-date"
                                className="flex items-center gap-2 text-sm font-medium text-base-content/80"
                            >
                                <span>Datum návštěvy</span>
                            </label>
                            <input
                                id="visit-date"
                                type="date"
                                value={visitedDate}
                                min="1800-01-01"
                                max={maxDate}
                                className="input input-bordered h-14 w-full rounded-2xl border-base-300 bg-base-100 px-4 text-base text-base-content"
                                onChange={(event) => setVisitedDate(event.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="visit-time"
                                className="flex items-center gap-2 text-sm font-medium text-base-content/80"
                            >
                                <span>Čas návštěvy</span>
                            </label>
                            <div className="rounded-2xl border border-base-300 bg-base-100 px-4 py-3 ring-offset-2 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                                <input
                                    id="visit-time"
                                    value={visitedTime}
                                    type="time"
                                    name="time"
                                    className="w-full bg-transparent text-base text-base-content outline-hidden"
                                    onChange={(event) => setVisitedTime(event.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="visit-text"
                            className="text-sm font-medium text-base-content/80"
                        >
                            Popis návštěvy
                        </label>
                        <textarea
                            id="visit-text"
                            className="textarea h-40 w-full rounded-3xl border border-base-300 bg-base-100 px-4 py-3 text-sm text-base-content resize-none md:resize-y"
                            value={visitedText}
                            maxLength={1000}
                            placeholder="Co se vám líbilo? Jak jste se na rozhlednu dostali? Co vás překvapilo? Jaké bylo počasí?"
                            onChange={(event) => setVisitedText(event.target.value)}
                            disabled={loading}
                        ></textarea>
                        <div className="flex items-center justify-between text-xs text-base-content/55">
                            <span>Volitelné, jen pro vaše poznámky.</span>
                            <span>{visitedText.length}/1000</span>
                        </div>
                    </div>

                    <div className="space-y-3 rounded-3xl border border-base-300/70 bg-base-200/35 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <label className="text-sm font-medium text-base-content/80">
                                Přidat fotky
                            </label>
                            <span className="text-xs text-base-content/55">
                                Max. {MAX_VISIT_PHOTOS} fotografií, do 5 MB na soubor.
                            </span>
                        </div>

                        <input
                            ref={fileSelectorRef}
                            id="visit-photos"
                            type="file"
                            className="hidden"
                            onChange={handleFileInput}
                            multiple
                            accept="image/*"
                            disabled={!allowAddPhoto || loading}
                        />

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                className="btn btn-primary btn-sm sm:btn-md"
                                onClick={() => fileSelectorRef.current?.click()}
                                disabled={!allowAddPhoto || loading}
                            >
                                Vybrat fotky
                            </button>
                            <span className="text-sm text-base-content/60">
                                {allowAddPhoto
                                    ? `Zbývá přidat ${MAX_VISIT_PHOTOS - photos.length - photosToUpload.length} fotografií.`
                                    : "Dosáhli jste maximálního počtu fotografií."}
                            </span>
                        </div>

                        {fileError ? <p className="text-sm text-error">{fileError}</p> : null}

                        {photosToUpload.length > 0 ? (
                            <div className="space-y-3">
                                {photosToUpload.map((photo) => (
                                    <div
                                        key={`${photo.name}-${photo.lastModified}`}
                                        className="flex items-center justify-between gap-3 rounded-2xl border border-base-300 bg-base-100 px-4 py-3 text-sm"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-base-300 bg-base-200">
                                                {photoPreviewUrls[
                                                    `${photo.name}-${photo.lastModified}`
                                                ] ? (
                                                    <Image
                                                        src={
                                                            photoPreviewUrls[
                                                                `${photo.name}-${photo.lastModified}`
                                                            ]
                                                        }
                                                        alt="Náhled nově přidané fotografie"
                                                        width={96}
                                                        height={96}
                                                        unoptimized
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-[10px] text-base-content/50">
                                                        Foto
                                                    </div>
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate font-medium text-base-content">
                                                    {photo.name}
                                                </p>
                                                <p className="text-xs text-base-content/55">
                                                    {formatFileSize(photo.size)}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-sm text-error"
                                            onClick={() => {
                                                setPhotosToUpload(
                                                    photosToUpload.filter((file) => file !== photo)
                                                );
                                                setFileError(null);
                                            }}
                                        >
                                            Odebrat
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : null}

                        {photos.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                {photos.map((photo) => (
                                    <div
                                        key={photo.url}
                                        className="relative overflow-hidden rounded-2xl border border-base-300 bg-base-100"
                                    >
                                        <Image
                                            src={photo.url}
                                            alt="Fotografie z návštěvy"
                                            width={320}
                                            height={224}
                                            className="h-28 w-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-error btn-circle btn-xs absolute right-2 top-2"
                                            onClick={() => {
                                                setPhotos(photos.filter((item) => item !== photo));
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>

                    <div className="space-y-3 rounded-3xl border border-base-300/70 bg-base-200/35 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <label className="text-sm font-medium text-base-content/80">
                                Přidat odkazy
                            </label>
                            <span className="text-xs text-base-content/55">
                                Například Strava, mapy nebo vlastní poznámka s odkazem.
                            </span>
                        </div>

                        <div className="flex flex-col gap-2">
                            {urls.map((url, idx) => (
                                <input
                                    key={idx}
                                    type="url"
                                    value={url}
                                    placeholder="https://www.strava.com/activities/12345"
                                    className="input input-bordered w-full rounded-2xl border-base-300 bg-base-100 text-sm"
                                    inputMode="url"
                                    onChange={(event) => {
                                        const nextUrls = [...urls];
                                        nextUrls[idx] = event.target.value;
                                        setUrls(nextUrls);
                                    }}
                                    disabled={loading}
                                />
                            ))}
                        </div>

                        {urls.length < MAX_VISIT_LINKS ? (
                            <button
                                type="button"
                                className="btn btn-outline btn-primary btn-sm self-start"
                                onClick={() => {
                                    setUrls([...urls, ""]);
                                }}
                                disabled={loading}
                            >
                                Přidat další odkaz
                            </button>
                        ) : null}
                    </div>
                </div>

                <div className="modal-action mt-8 flex-col gap-3 border-t border-base-300/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
                        {initVisit ? (
                            <button
                                type="button"
                                className="btn btn-outline btn-error w-full"
                                onClick={remove}
                                disabled={loading}
                            >
                                Odstranit návštěvu
                            </button>
                        ) : null}
                        <button
                            type="button"
                            className="btn btn-outline w-full"
                            onClick={() => ref.current?.close()}
                            disabled={loading}
                        >
                            Zavřít
                        </button>
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary w-full sm:min-w-44 sm:w-auto"
                        onClick={update}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            "Uložit návštěvu"
                        )}
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button type="submit" aria-label="Zavřít modal návštěvy">
                    Zavřít
                </button>
            </form>
        </dialog>
    );
};
