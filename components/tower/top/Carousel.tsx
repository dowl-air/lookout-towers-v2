"use client";

import { ImagePlus, Images } from "lucide-react";
import Image from "next/image";
import { ReactNode, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/counter.css";

import { Photo } from "@/types/Photo";
import { Tower } from "@/types/Tower";

const Carousel = ({
    images,
    userImages,
    tower,
    children,
}: {
    images: string[];
    userImages: Photo[];
    tower: Tower;
    children?: ReactNode;
}) => {
    const lightboxStyles = {
        root: {
            "--yarl__portal_zindex": 20000,
        },
    } as const;

    const [open, setOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleLightboxOpen = (index: number) => {
        requestAnimationFrame(() => {
            setCurrentSlide(index);
        });
        setOpen(true);
    };

    const allImagesWithMainFirst: Photo[] = [
        ...images.map((image) => ({
            url: image,
            created: new Date(),
            id: "",
            user_id: "",
            tower_id: tower.id,
            isPublic: true,
            isMain: false,
        })),
        ...userImages,
    ].sort((a, b) => {
        if (a.isMain === b.isMain) return 0;
        if (a.isMain) return -1;
        return 1;
    });
    const sideImages = allImagesWithMainFirst.slice(1, 3);

    return (
        <>
            <div className="w-full">
                <figure
                    data-testid="tower-hero-gallery-main"
                    className="m-0 grid overflow-hidden rounded-lg border border-base-300/70 bg-linear-to-br from-base-100 via-base-100 to-primary/10 shadow-lg lg:h-[min(70vh,36rem)] lg:min-h-128 lg:grid-cols-2"
                >
                    <div className="flex min-h-0 flex-col p-5 sm:p-8 lg:p-10">{children}</div>

                    <div
                        data-testid="tower-hero-gallery-panel"
                        className="min-h-0 border-t border-base-300/70 bg-base-200/25 p-3 lg:overflow-hidden lg:border-l lg:border-t-0"
                    >
                        <div className="relative grid min-h-0 gap-2 sm:grid-cols-[minmax(0,2fr)_minmax(7rem,1fr)] lg:h-full 2xl:grid-cols-[minmax(0,2fr)_minmax(9rem,1fr)]">
                            <button
                                type="button"
                                data-testid="tower-hero-full-photo"
                                className="relative h-80 cursor-pointer overflow-hidden rounded-md border-0 bg-transparent p-0 shadow-none transition hover:brightness-105 sm:h-112 lg:h-full lg:min-h-0"
                                onClick={() => handleLightboxOpen(0)}
                                aria-label="Zobrazit hlavní fotografii v galerii"
                            >
                                <Image
                                    priority
                                    fill
                                    src={allImagesWithMainFirst[0].url}
                                    alt={tower.name}
                                    className="object-cover"
                                    sizes="(min-width: 1024px) 34rem, 100vw"
                                    unoptimized={allImagesWithMainFirst[0].id === ""}
                                />
                            </button>

                            <div className="absolute right-2 top-2 z-10 flex gap-2">
                                <button
                                    type="button"
                                    className="btn btn-sm border-base-300/80 bg-base-100/90 shadow-md backdrop-blur"
                                    onClick={() => handleLightboxOpen(0)}
                                >
                                    <Images className="size-4" />
                                    {allImagesWithMainFirst.length} fotek
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-square btn-sm border-base-300/80 bg-base-100/90 shadow-md backdrop-blur"
                                    aria-label="Přidat fotky"
                                    title="Přidávání fotek připravujeme"
                                >
                                    <ImagePlus className="size-4" />
                                </button>
                            </div>

                            {sideImages.length ? (
                                <div
                                    data-testid="tower-hero-thumbnails"
                                    className={`grid min-h-0 gap-2 ${sideImages.length > 1 ? "grid-cols-2" : "grid-cols-1"} sm:grid-cols-1 sm:grid-rows-2`}
                                >
                                    {sideImages.map((image, idx) => {
                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                className="relative h-28 min-h-0 cursor-pointer overflow-hidden rounded-md border border-base-300 bg-base-200 transition hover:brightness-105 sm:h-full"
                                                onClick={() => handleLightboxOpen(idx + 1)}
                                            >
                                                <Image
                                                    src={image.url}
                                                    alt={tower.name}
                                                    fill
                                                    sizes="(min-width: 1536px) 18rem, (min-width: 1024px) 16rem, (min-width: 640px) 33vw, 50vw"
                                                    className="object-cover"
                                                    // only optimize new user images
                                                    unoptimized={image.id === ""}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </figure>
            </div>
            <Lightbox
                open={open}
                close={() => setOpen(false)}
                styles={lightboxStyles}
                slides={allImagesWithMainFirst.map((image) => {
                    return {
                        src: image.url,
                        caption: tower.name,
                    };
                })}
                index={currentSlide}
                plugins={[Counter, Slideshow, Fullscreen, Thumbnails, Zoom]}
                counter={{ container: { style: { top: 0, bottom: "unset" } } }}
                thumbnails={{
                    border: 0,
                    imageFit: "cover",
                }}
            />
        </>
    );
};

export default Carousel;
