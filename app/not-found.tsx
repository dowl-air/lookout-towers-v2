import { Compass, House } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-dvh flex-col bg-base-100 text-base-content">
            <header className="border-b border-base-300/70">
                <div className="mx-auto flex w-full max-w-7xl items-center px-4 py-4 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="flex items-center gap-3 font-semibold focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-100"
                    >
                        <Image src="/img/logo.png" alt="Rozhlednový svět" width={40} height={40} />
                        <span className="text-lg sm:text-xl">Rozhlednový svět</span>
                    </Link>
                </div>
            </header>

            <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:py-24">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                    Chyba 404
                </p>
                <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Tady už cesta nevede</h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-base-content/70 sm:text-lg">
                    Požadovanou stránku jsme nenašli. Mohla se přesunout, nebo zadaná adresa není
                    správná.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link className="btn btn-primary" href="/">
                        <House size={18} aria-hidden="true" />
                        Na úvodní stránku
                    </Link>
                    <Link className="btn btn-outline" href="/mapa">
                        <Compass size={18} aria-hidden="true" />
                        Otevřít mapu
                    </Link>
                </div>
            </section>
        </main>
    );
}
