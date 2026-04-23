import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import FooterCopyright from "@/components/footer/FooterCopyright";
import UserVisitLevels from "@/components/shared/UserVisitLevels";

function Footer() {
    return (
        <footer className="border-t border-base-300/70 bg-neutral text-neutral-content">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-12 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[1.4fr_0.9fr_0.9fr_1fr]">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <Image
                                src="/img/logo.png"
                                alt="Rozhlednový svět"
                                className="h-10 w-10"
                                width={494}
                                height={505}
                            />
                            <h2 className="text-2xl font-bold tracking-tight">Rozhlednový svět</h2>
                        </div>
                        <p className="max-w-md text-sm leading-6 text-neutral-content/75 sm:text-base">
                            Komunitní průvodce rozhlednami, vyhlídkami a místy s výhledem po celém
                            Česku. Pomáhá objevovat nové cíle, plánovat výlety a vracet se k místům,
                            která stojí za návštěvu.
                        </p>
                        <p className="max-w-md text-sm leading-6 text-neutral-content/60">
                            Databáze propojuje veřejně dostupné informace, mapu, komunitní aktivitu
                            i osobní přehled navštívených míst.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-content/60">
                            Prozkoumat
                        </h3>
                        <nav
                            aria-label="Footer navigation"
                            className="flex flex-col gap-3 text-sm sm:text-base"
                        >
                            <Link className="link-hover link w-fit" href="/rozhledny">
                                Procházet rozhledny
                            </Link>
                            <Link className="link-hover link w-fit" href="/mapa">
                                Prozkoumat mapu
                            </Link>
                            <Link className="link-hover link w-fit" href="/komunita">
                                Komunita
                            </Link>
                        </nav>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-content/60">
                            O obsahu
                        </h3>
                        <ul className="space-y-3 text-sm leading-6 text-neutral-content/75 sm:text-base">
                            <li>
                                Rozhledny, věže, vyhlídky a další místa s výhledem na jednom místě.
                            </li>
                            <li>
                                Mapové procházení, detailní profily míst a komunitní přehled
                                aktivity.
                            </li>
                            <li>
                                Průběžně rozšiřovaná databáze zaměřená na praktickou orientaci i
                                inspiraci na výlet.
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/10">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-content/60">
                            Instagram
                        </h3>
                        <p className="text-sm leading-6 text-neutral-content/75 sm:text-base">
                            Sledujte nové tipy, výhledy a dění kolem projektu na oficiálním profilu.
                        </p>
                        <a
                            href="https://www.instagram.com/rozhlednovysvet/"
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-outline btn-sm w-fit border-white/20 text-white hover:border-white hover:bg-white hover:text-neutral"
                        >
                            Instagram @rozhlednovysvet
                        </a>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2 border-t border-white/10 pt-6 text-sm text-neutral-content/60 sm:text-base">
                    <p>Rozhlednový svět slouží jako veřejně dostupný katalog.</p>
                    <Suspense fallback={null}>
                        <FooterCopyright />
                    </Suspense>
                </div>
            </div>
            <UserVisitLevels />
        </footer>
    );
}

export default Footer;
