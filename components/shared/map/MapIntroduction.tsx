"use client";

import { ChevronDown, ChevronUp, MapPinned } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function MapIntroduction() {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <section className="absolute left-4 top-4 z-1010 max-w-[calc(100%-2rem)] sm:max-w-sm">
            <div className="overflow-hidden rounded-lg border border-base-300/80 bg-base-100/95 shadow-xl backdrop-blur-sm">
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="flex min-w-0 items-center gap-2">
                        <MapPinned className="size-5 shrink-0 text-primary" aria-hidden="true" />
                        <h1 className="text-base font-bold text-base-content sm:text-lg">
                            Mapa rozhleden a věží
                        </h1>
                    </div>
                    <button
                        type="button"
                        className="btn btn-ghost btn-square btn-sm shrink-0"
                        onClick={() => setIsOpen((open) => !open)}
                        aria-expanded={isOpen}
                        aria-controls="map-introduction-content"
                        aria-label={isOpen ? "Skrýt informace o mapě" : "Zobrazit informace o mapě"}
                    >
                        {isOpen ? (
                            <ChevronUp className="size-5" aria-hidden="true" />
                        ) : (
                            <ChevronDown className="size-5" aria-hidden="true" />
                        )}
                    </button>
                </div>
                {isOpen ? (
                    <div
                        id="map-introduction-content"
                        className="px-4 pb-4 text-sm leading-6 text-base-content/80"
                    >
                        <p>
                            Prozkoumejte místa s výhledem přehledně na mapě. Vyberte značku a
                            najděte další cíl pro váš výlet.
                        </p>
                        <Link
                            href="/rozhledny"
                            className="link link-primary mt-2 inline-flex font-semibold"
                        >
                            Procházet celý katalog
                        </Link>
                    </div>
                ) : null}
            </div>
        </section>
    );
}
