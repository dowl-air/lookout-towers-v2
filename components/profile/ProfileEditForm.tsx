"use client";

import { Pencil } from "lucide-react";
import { type ChangeEvent, useActionState, useEffect, useState } from "react";

import { type ProfileUpdateState, updateProfile } from "@/actions/profile/profile.update";
import UserProfileAvatar from "@/components/UserProfileAvatar";

const initialState: ProfileUpdateState = {};

type ProfileEditFormProps = {
    image?: string | null;
    name: string;
};

function ProfileEditForm({ image, name }: ProfileEditFormProps) {
    const [state, formAction, isPending] = useActionState(updateProfile, initialState);
    const [previewUrl, setPreviewUrl] = useState<string>();
    const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    useEffect(() => {
        if (state.success) {
            dialog?.close();
        }
    }, [dialog, state.success]);

    const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setPreviewUrl(file ? URL.createObjectURL(file) : undefined);
    };

    return (
        <>
            <button
                type="button"
                className="btn btn-ghost btn-square btn-sm"
                title="Upravit profil"
                aria-label="Upravit profil"
                onClick={() => dialog?.showModal()}
            >
                <Pencil size={18} aria-hidden="true" />
            </button>
            <dialog ref={setDialog} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box max-w-lg">
                    <form action={formAction} className="flex flex-col gap-5">
                        <div>
                            <h2 id="profile-edit-heading" className="text-lg font-semibold">
                                Upravit profil
                            </h2>
                            <p className="mt-1 text-sm text-base-content/70">
                                Změňte své zobrazované jméno nebo profilovou fotku.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            {previewUrl ? (
                                <div className="avatar">
                                    <div className="w-16 rounded-full">
                                        {/* Local blob URLs cannot be optimized by next/image. */}
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={previewUrl} alt="Náhled nové profilové fotky" />
                                    </div>
                                </div>
                            ) : (
                                <UserProfileAvatar
                                    name={name}
                                    image={image ?? undefined}
                                    size={64}
                                />
                            )}
                            <div className="flex min-w-0 flex-col gap-1">
                                <label
                                    className="label w-fit cursor-pointer p-0"
                                    htmlFor="profile-avatar"
                                >
                                    <span className="label-text">Profilová fotka</span>
                                </label>
                                <input
                                    id="profile-avatar"
                                    name="avatar"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="file-input file-input-bordered file-input-sm w-full max-w-xs"
                                    onChange={handleAvatarChange}
                                    disabled={isPending}
                                />
                                <p className="text-xs text-base-content/60">
                                    JPG, PNG nebo WebP, maximálně 5 MB.
                                </p>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label" htmlFor="profile-name">
                                <span className="label-text">Zobrazované jméno</span>
                            </label>
                            <input
                                id="profile-name"
                                name="name"
                                type="text"
                                className="input input-bordered w-full"
                                defaultValue={name}
                                maxLength={50}
                                required
                                disabled={isPending}
                            />
                        </div>

                        {state.error ? (
                            <p className="text-sm text-error" role="alert">
                                {state.error}
                            </p>
                        ) : null}

                        <div className="modal-action">
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={() => dialog?.close()}
                                disabled={isPending}
                            >
                                Zrušit
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={isPending}>
                                {isPending ? "Ukládám..." : "Uložit profil"}
                            </button>
                        </div>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button aria-label="Zavřít úpravu profilu">Zavřít</button>
                </form>
            </dialog>
        </>
    );
}

export default ProfileEditForm;
