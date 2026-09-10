import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { connection } from "next/server";

import { checkAdmin } from "@/actions/checkAdmin";
import TowerPhotoManagement, { ManagedTowerPhoto } from "@/components/admin/TowerPhotoManagement";
import { listTowerPhotos } from "@/data/photo/tower-photos";
import { listTowerGalleryPhotos } from "@/data/tower/tower-gallery";
import { getTowerObjectByNameID } from "@/data/tower/towers";
import { isSamePhotoUrl } from "@/utils/photoUrl";
import { getCanonicalTowerPath, isCanonicalTowerType } from "@/utils/towerRoute";

export const metadata: Metadata = {
    title: "Upravit fotografie",
};

const EditTowerPhotosPage = async ({
    params,
}: {
    params: Promise<{ type: string; nameID: string }>;
}) => {
    await connection();
    if (!(await checkAdmin())) redirect("/403");

    const { type, nameID } = await params;
    const tower = await getTowerObjectByNameID(nameID);
    if (!tower) notFound();
    if (!isCanonicalTowerType(type, tower)) {
        permanentRedirect(`${getCanonicalTowerPath(tower)}/edit-photos`);
    }

    const [galleryPhotos, userPhotos] = await Promise.all([
        listTowerGalleryPhotos(tower.id),
        listTowerPhotos(tower.id),
    ]);
    const photos: ManagedTowerPhoto[] = [
        ...galleryPhotos.map((photo) => ({
            id: `gallery:${photo.storagePath}`,
            isMain: isSamePhotoUrl(tower.mainPhotoUrl, photo.url),
            photo: { kind: "gallery" as const, storagePath: photo.storagePath },
            source: `Původní galerie: ${photo.storagePath}`,
            url: photo.url,
        })),
        ...userPhotos.map((photo) => ({
            id: `user:${photo.id}`,
            isMain: isSamePhotoUrl(tower.mainPhotoUrl, photo.url),
            photo: { kind: "user" as const, photoId: photo.id },
            source: photo.note?.url
                ? `Uživatel ${photo.user_id}: ${photo.note.url}`
                : `Nahrál uživatel ${photo.user_id}`,
            url: photo.url,
        })),
    ];
    const towerPath = getCanonicalTowerPath(tower);

    return (
        <main className="mx-auto my-8 w-full max-w-7xl space-y-6 px-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold sm:text-3xl">Fotografie: {tower.name}</h1>
                    <p className="mt-1 text-sm opacity-70">{photos.length} fotografií v galerii</p>
                </div>
                <Link href={towerPath} className="btn">
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    Zpět na rozhlednu
                </Link>
            </div>

            <TowerPhotoManagement photos={photos} towerId={tower.id} />
        </main>
    );
};

export default EditTowerPhotosPage;
