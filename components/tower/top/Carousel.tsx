"use client";
import Lightbox from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/counter.css";

import { cn } from "@/utils/cn";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Tower } from "@/typings";

const Carousel = ({ images, tower }: { images: string[]; tower: Tower }) => {
    const [loadingMain, setLoadingMain] = useState<boolean>(true);
    const imgRef = useRef<HTMLImageElement>(null);
    const [open, setOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        // Check if the main image has already loaded
        if (imgRef.current && imgRef.current.complete) {
            setLoadingMain(false);
        }
    }, []);

    const handleLightboxOpen = (index: number) => {
        requestAnimationFrame(() => {
            setCurrentSlide(index);
        });
        setOpen(true);
    };

    return (
        <>
            <div className="flex flex-col sm:mb-7 w-full md:w-[560px] xl:w-[600px]">
                <figure className="hidden sm:block h-56 sm:h-80 md:h-96 mt-4 lg:mt-10 mb-2">
                    <div className="flex h-56 sm:h-80 md:h-96 w-full justify-center items-center">
                        <Image
                            priority
                            alt={tower.name}
                            src={images[0]}
                            className={cn(
                                "object-contain rounded-xl h-56 sm:h-80 md:h-96 w-auto cursor-pointer hover:scale-[1.015] transform transition-transform",
                                {
                                    hidden: loadingMain,
                                }
                            )}
                            onLoad={() => setLoadingMain(false)}
                            ref={imgRef}
                            height={600}
                            width={600}
                            onClick={() => handleLightboxOpen(0)}
                            unoptimized
                        />
                        <span
                            className={cn("skeleton w-full h-full rounded-xl mx-20", {
                                hidden: !loadingMain,
                            })}
                        ></span>
                    </div>
                </figure>

                <div
                    className="mt-6 md:mt-0 h-28 w-auto p-1 flex overflow-x-hidden overflow-y-visible gap-2 my-3"
                    style={{
                        maskImage: "linear-gradient(to right, rgba(0, 0, 0, 1) 65%, rgba(0, 0, 0, 0) 96%)",
                    }}
                >
                    {images.map((image, idx) => {
                        return (
                            <Image
                                key={idx}
                                src={image}
                                alt={tower.name}
                                height={112}
                                width={112}
                                className="sm:first:hidden object-cover rounded-lg cursor-pointer hover:scale-[1.03] transform transition-transform w-auto h-auto"
                                unoptimized
                                onClick={() => handleLightboxOpen(idx)}
                            />
                        );
                    })}
                </div>
            </div>
            <Lightbox
                open={open}
                close={() => setOpen(false)}
                slides={images.map((image) => {
                    return {
                        src: image,
                        caption: tower.name,
                    };
                })}
                index={currentSlide}
                plugins={[Counter, Slideshow, Fullscreen, Thumbnails]}
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
