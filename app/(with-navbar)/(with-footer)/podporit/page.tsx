import { Camera, Check, Heart, MapPinned, Server, Wrench } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";

import SupportPayment from "@/components/support/SupportPayment";
import { SITE_URL } from "@/utils/constants";

const SUPPORT_DESCRIPTION =
    "Podpořte dobrovolným příspěvkem provoz a další rozvoj komunitního webu Rozhlednový svět.";

export const metadata: Metadata = {
    title: "Podpořte Rozhlednový svět",
    description: SUPPORT_DESCRIPTION,
    alternates: {
        canonical: `${SITE_URL}/podporit`,
    },
    openGraph: {
        title: "Podpořte Rozhlednový svět",
        description: SUPPORT_DESCRIPTION,
        url: `${SITE_URL}/podporit`,
        type: "website",
        images: [
            {
                url: `${SITE_URL}/img/rozhledna_bukovka_cr.jpg`,
                width: 1200,
                height: 630,
                alt: "Rozhledna Bukovka v krajině",
            },
        ],
    },
};

const SUPPORT_USES = [
    { icon: Server, text: "Provoz, hosting a technické služby" },
    { icon: Camera, text: "Ukládání fotografií a dat" },
    { icon: Wrench, text: "Vývoj, údržba a nové funkce" },
    { icon: MapPinned, text: "Rozšiřování a zpřesňování databáze" },
];

export default function SupportPage() {
    return (
        <main>
            <section className="relative flex min-h-125 items-end overflow-hidden sm:min-h-140">
                <Image
                    src="/img/rozhledna_bukovka.jpg"
                    alt="Rozhledna Bukovka nad krajinou"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-[68%_center]"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/10" />
                <div className="relative mx-auto w-full max-w-7xl px-5 pb-12 pt-28 text-white sm:px-8 sm:pb-16 lg:pb-20">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                            Pomozte rozvíjet Rozhlednový svět
                        </h1>
                        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">
                            Rozhlednový svět vzniká ve volném čase a zůstává zdarma pro všechny.
                            Pokud vám pomáhá objevovat nová místa, můžete přispět na jeho provoz a
                            další rozvoj.
                        </p>
                    </div>
                </div>
            </section>

            <section className="border-b border-base-300 bg-primary text-primary-content">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:px-8">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-content text-primary">
                        <Check aria-hidden="true" size={24} strokeWidth={3} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold sm:text-2xl">Web je a zůstává zdarma</h2>
                        <p className="mt-1 max-w-4xl leading-7 text-primary-content/75">
                            Přístup ke katalogu, mapě i uživatelským funkcím není podmíněný
                            příspěvkem. Podpora je zcela dobrovolná a žádný obsah tím neodemykáte.
                        </p>
                    </div>
                </div>
            </section>

            <section className="bg-base-200/70 py-16 sm:py-20">
                <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
                    <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
                        <h2 className="text-3xl font-bold sm:text-4xl">
                            Líbí se vám Rozhlednový svět?
                        </h2>
                        <p className="mt-4 text-lg leading-8 text-base-content/70">
                            Každý den pomáhá lidem najít nové rozhledny a plánovat výlety. Pokud vám
                            už někdy pomohl objevit místo, které stálo za návštěvu, můžete podpořit
                            jeho další fungování.
                        </p>
                    </div>
                    <SupportPayment />
                    <div className="mx-auto mt-6 max-w-3xl text-center leading-6">
                        <p className="text-sm font-medium text-base-content/70">
                            Příspěvek je zcela dobrovolný a slouží k podpoře provozu a rozvoje
                            projektu. Nejde o nákup služby ani předplatné.
                        </p>
                        <p className="mt-1 text-xs text-base-content/50">
                            Příspěvek je zasílán na osobní účet autora projektu.
                        </p>
                    </div>
                </div>
            </section>

            <section className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                <div>
                    <h2 className="text-3xl font-bold sm:text-4xl">Kam vaše podpora putuje</h2>
                    <p className="mt-4 text-lg leading-8 text-base-content/70">
                        Rozhlednový svět vzniká a roste ve volném čase. Příspěvky pomáhají pokrývat
                        skutečné náklady na provoz a dávají prostor přidávat nové funkce a
                        rozšiřovat databázi.
                    </p>
                </div>
                <ul className="grid gap-px overflow-hidden rounded-lg border border-base-300 bg-base-300 sm:grid-cols-2">
                    {SUPPORT_USES.map(({ icon: Icon, text }) => (
                        <li key={text} className="flex items-center gap-4 bg-base-100 p-6">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Icon aria-hidden="true" size={22} />
                            </span>
                            <span className="font-semibold leading-6">{text}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="border-t border-base-300 bg-primary px-5 py-14 text-center text-primary-content sm:px-8 sm:py-16">
                <div className="mx-auto max-w-3xl">
                    <h2 className="flex items-center justify-center gap-3 text-3xl font-bold sm:text-4xl">
                        Děkuji za podporu
                        <Heart aria-hidden="true" size={32} fill="currentColor" />
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-primary-content/75">
                        Ať už přispějete, používáte web nebo ho doporučíte někomu dalšímu, pomáháte
                        Rozhlednovému světu růst.
                    </p>
                </div>
            </section>
        </main>
    );
}
