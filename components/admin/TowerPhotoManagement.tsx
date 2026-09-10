"use client";

import { Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import {
    AdminTowerPhoto,
    removeTowerPhoto,
    setTowerMainPhoto,
    TowerPhotoActionState,
} from "@/actions/admin/tower-photos.action";

export type ManagedTowerPhoto = {
    id: string;
    isMain: boolean;
    photo: AdminTowerPhoto;
    source: string;
    url: string;
};

const TowerPhotoManagement = ({
    photos,
    towerId,
}: {
    photos: ManagedTowerPhoto[];
    towerId: string;
}) => {
    const router = useRouter();
    const [pendingId, setPendingId] = useState<string>();
    const [state, setState] = useState<TowerPhotoActionState>();

    const runAction = (
        photo: ManagedTowerPhoto,
        action: (towerId: string, target: AdminTowerPhoto) => Promise<TowerPhotoActionState>
    ) => {
        setPendingId(photo.id);
        setState(undefined);
        startTransition(async () => {
            const result = await action(towerId, photo.photo);
            setState(result);
            setPendingId(undefined);
            if (result.success) router.refresh();
        });
    };

    if (!photos.length) {
        return (
            <p className="rounded-lg border border-base-300 p-5">Galerie nemá žádné fotografie.</p>
        );
    }

    return (
        <div className="space-y-4">
            {state?.error ? <div className="alert alert-error">{state.error}</div> : null}
            {state?.success ? <div className="alert alert-success">Změna byla uložena.</div> : null}

            <div className="overflow-x-auto rounded-lg border border-base-300">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Fotografie</th>
                            <th>Zdroj</th>
                            <th>Stav</th>
                            <th className="text-right">Akce</th>
                        </tr>
                    </thead>
                    <tbody>
                        {photos.map((photo) => {
                            const isPending = pendingId === photo.id;

                            return (
                                <tr key={photo.id}>
                                    <td>
                                        <a
                                            href={photo.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="relative block h-20 w-28 overflow-hidden rounded-md bg-base-200"
                                        >
                                            <Image
                                                fill
                                                src={photo.url}
                                                alt=""
                                                sizes="112px"
                                                className="object-cover"
                                                unoptimized={photo.photo.kind === "gallery"}
                                            />
                                        </a>
                                    </td>
                                    <td className="max-w-80 whitespace-normal break-words text-sm">
                                        {photo.source}
                                    </td>
                                    <td>
                                        {photo.isMain ? (
                                            <span className="badge badge-primary gap-1">
                                                <Star className="size-3" aria-hidden="true" />
                                                Hlavní
                                            </span>
                                        ) : (
                                            <span className="text-sm opacity-60">V galerii</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-sm"
                                                disabled={photo.isMain || Boolean(pendingId)}
                                                onClick={() => runAction(photo, setTowerMainPhoto)}
                                            >
                                                <Star className="size-4" aria-hidden="true" />
                                                Nastavit jako hlavní
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-error btn-square btn-sm"
                                                aria-label="Smazat fotografii"
                                                title="Smazat fotografii"
                                                disabled={Boolean(pendingId)}
                                                onClick={() => {
                                                    if (
                                                        window.confirm(
                                                            "Opravdu chcete tuto fotografii nenávratně smazat?"
                                                        )
                                                    ) {
                                                        runAction(photo, removeTowerPhoto);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="size-4" aria-hidden="true" />
                                                {isPending ? (
                                                    <span className="loading loading-spinner loading-xs" />
                                                ) : null}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TowerPhotoManagement;
