"use client";

import { cn } from "@/utils/cn";

const PhotosUpload = ({
    photos,
    setPhotos,
    mainIndex,
    setMainIndex,
}: {
    photos: (File | string)[];
    setPhotos: (p: unknown) => void;
    mainIndex: number;
    setMainIndex: (p: number) => void;
}) => {
    const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhotos((prevPhotos) => [...prevPhotos, ...Array.from(e.target.files)]);
    };

    const handleFileRemove = (index: number) => {
        setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
    };

    return (
        <>
            <div className="flex items-center gap-3 justify-between flex-wrap">
                <input type="file" multiple className="file-input" onChange={handleFilesSelect} />
                <div className="flex items-center gap-3">
                    <input id="input-photo-url" type="text" placeholder="Vložit odkaz na fotku" className="input input-bordered" />
                    <button
                        className="btn"
                        onClick={() => {
                            const elm = document.getElementById("input-photo-url") as HTMLInputElement;
                            try {
                                const url = new URL(elm.value);
                                setPhotos((prevPhotos) => [...prevPhotos, new URL(url).toString()]);
                                elm.value = "";
                            } catch {
                                console.error("Invalid URL");
                                return;
                            }
                        }}
                    >
                        Přidat
                    </button>
                </div>
            </div>
            <div className="flex gap-4 flex-wrap">
                {photos.map((photo, index) => (
                    <div
                        key={index}
                        title="Kliknutím nastavíte jako hlavní"
                        className={cn("relative cursor-pointer rounded-lg mt-3", { "ring-2 ring-primary ring-offset-4": index === mainIndex })}
                        onClick={() => setMainIndex(index)}
                    >
                        <img
                            src={photo instanceof File ? URL.createObjectURL(photo) : photo.toString()}
                            alt="preview"
                            className="w-36 h-36 object-cover rounded-lg"
                        />
                        <button
                            className="absolute top-1 right-1 p-1.5 bg-error text-white rounded-full font-bold cursor-pointer"
                            onClick={() => handleFileRemove(index)}
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
};

export default PhotosUpload;
