"use client";

import { Tower } from "@/types/Tower";
import { Visit } from "@/types/Visit";
import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/counter.css";

const VisitPhotos = ({ visit, tower }: { visit: Visit; tower: Tower }) => {
    const [open, setOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    if (!visit.photos) return null;
    if (visit.photos.length === 0) return null;

    const handleLightbox = (index: number) => {
        requestAnimationFrame(() => {
            setCurrentSlide(index);
        });
        setOpen(true);
    };

    return (
        <>
            <div className="flex flex-col gap-3 basis-56">
                <p className="text-base opacity-50 grow-0">Moje fotografie</p>
                <div className="flex flex-wrap gap-2">
                    {visit.photos.map((photo, idx) => (
                        <figure
                            key={idx}
                            onClick={() => handleLightbox(idx)}
                            className="w-16 h-16 relative rounded-lg overflow-hidden cursor-pointer"
                        >
                            <Image
                                alt={tower.name}
                                src={photo.url}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
                                className="object-cover"
                                unoptimized
                                fill
                            />
                        </figure>
                    ))}
                </div>
            </div>

            <Lightbox
                open={open}
                carousel={{
                    finite: true,
                }}
                close={() => setOpen(false)}
                slides={visit.photos.map((image) => {
                    return {
                        src: image.url,
                    };
                })}
                index={currentSlide}
                plugins={[Counter, Fullscreen, Thumbnails]}
                counter={{ container: { style: { top: 0, bottom: "unset" } } }}
                thumbnails={{
                    border: 0,
                    imageFit: "cover",
                }}
            />
        </>
    );
};

export default VisitPhotos;
