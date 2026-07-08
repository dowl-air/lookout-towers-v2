"use client";

import { LocateFixed } from "lucide-react";
import { useState } from "react";

import useLocation from "@/hooks/useLocation";
import { cn } from "@/utils/cn";

type LocationPermissionPromptProps = {
    className?: string;
};

function LocationPermissionPrompt({ className }: LocationPermissionPromptProps) {
    const { error, isLocating, isSupported, permissionState, requestLocation } = useLocation({
        requestOnGranted: false,
    });
    const [isHidden, setIsHidden] = useState(false);

    if (!isSupported || permissionState === "granted" || isHidden) {
        return null;
    }

    const handleRequestLocation = async () => {
        try {
            await requestLocation();
            setIsHidden(true);
        } catch {
            setIsHidden(false);
        }
    };

    return (
        <section className={cn("w-full", className)}>
            <div className="flex flex-col gap-5 rounded-lg border border-base-300 bg-base-200/60 p-5 md:flex-row md:items-center md:justify-between md:p-6">
                <div className="flex min-w-0 flex-col gap-2">
                    <h2 className="text-2xl font-bold md:text-3xl">
                        Chcete vědět, jak daleko jsou rozhledny od vás?
                    </h2>
                    <p className="max-w-3xl text-base text-base-content/75">
                        Budete mít zobrazené vzdálenosti k rozhlednám a dostupné řazení podle
                        vzdálenosti. Poloha zůstává jen ve vašem prohlížeči a nikam ji neukládáme.
                    </p>
                    {permissionState === "denied" ? (
                        <p className="text-sm text-warning">
                            Přístup k poloze je v prohlížeči blokovaný. Změnit ho můžete v nastavení
                            webu.
                        </p>
                    ) : null}
                    {error && permissionState !== "denied" ? (
                        <p className="text-sm text-error">Polohu se nepodařilo načíst.</p>
                    ) : null}
                </div>
                <button
                    type="button"
                    className="btn btn-primary shrink-0"
                    onClick={handleRequestLocation}
                    disabled={isLocating || permissionState === "denied"}
                >
                    <LocateFixed className="size-5" aria-hidden="true" />
                    {isLocating ? "Zjišťuji polohu" : "Povolit polohu"}
                </button>
            </div>
        </section>
    );
}

export default LocationPermissionPrompt;
