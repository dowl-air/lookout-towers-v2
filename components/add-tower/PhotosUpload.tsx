"use client";

import { useState } from "react";

const PhotosUpload = () => {
    const [photos, setPhotos] = useState<(File | URL)[]>([]);

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
                                setPhotos((prevPhotos) => [...prevPhotos, new URL(url)]);
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
            <div className="flex gap-3 flex-wrap">
                {photos.map((photo, index) => (
                    <div key={index} className="relative">
                        <img
                            src={photo instanceof File ? URL.createObjectURL(photo) : photo.toString()}
                            alt="preview"
                            className="w-36 h-36 object-cover rounded-lg"
                        />
                        <button
                            className="absolute top-1 right-1 p-1.5 bg-error text-white rounded-full font-bold"
                            onClick={() => handleFileRemove(index)}
                        >
                            x
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
};

export default PhotosUpload;
