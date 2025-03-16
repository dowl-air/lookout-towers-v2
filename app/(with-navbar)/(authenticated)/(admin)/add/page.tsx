"use client";

import COUNTRIES, { CountryCode } from "@/constants/countries";
import { cn } from "@/utils/cn";
import { materials, towerType } from "@/utils/constants";
import { getAllCountiesFromCountryProvince, getAllCountryProvinces } from "@/utils/geography";
import dynamic from "next/dynamic";
import { useState } from "react";

const MapPicker = dynamic(() => import("@/components/add-tower/MapPicker"), { ssr: false });

const AddTowerPage = () => {
    const [name, setName] = useState<string>("");
    const [type, setType] = useState<string>("");

    const [country, setCountry] = useState<CountryCode | "">("");
    const [province, setProvince] = useState<string>("");
    const [county, setCounty] = useState<string>("");

    const [pickedPosition, setPickedPosition] = useState<{ latitude: number; longitude: number }>(null);
    const [clipboardError, setClipboardError] = useState<string>("");

    const parsePositionFromClipboard = async () => {
        const text = await navigator.clipboard.readText();
        if (!text) {
            setClipboardError("Nepodařilo se získat text ze schránky.");
            return;
        }

        const regex = /(-?\d{1,3}\.\d+)[°\s]?[NS]?,?\s*(-?\d{1,3}\.\d+)[°\s]?[EW]?/i;
        const match = regex.exec(text);

        if (match) {
            const latitude = parseFloat(match[1]);
            const longitude = parseFloat(match[2]);
            setPickedPosition({ latitude, longitude });
            setClipboardError("");
        } else {
            setClipboardError("Nepodařilo se získat GPS souřadnice ze schránky.");
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto mt-5 lg:mt-10 px-5 min-h-dvh">
            <article className="prose prose-sm lg:prose-base max-w-full">
                <h1 className="mb-2 md:mb-6 text-xl sm:text-2xl md:text-3xl lg:text-4xl">Přidat novou rozhlednu</h1>
                <p>
                    Můžete navrhnout přidání nové rozhledny do naší databáze. Čím více informací nám poskytnete, tím lépe. Pomůžete nám i ostatním
                    milovníkům rozhleden zlepšit naši databázi.
                    <br /> Doporučujeme se předem přesvědčit, zda se rozhledna již nenachází v naší databázi. V takovém případě nebude nová rozhledna
                    přidána.
                </p>
            </article>

            <h2 className="text-lg mt-6">Základní údaje</h2>

            <label
                className={cn("input input-bordered flex items-center gap-2 whitespace-nowrap text-sm sm:text-base mt-4", {
                    "input-primary": name,
                })}
            >
                Název rozhledny *
                <input type="text" className="grow font-bold" value={name} onChange={(e) => setName(e.target.value)} />
            </label>

            <select
                className={cn("select select-bordered w-full text-sm sm:text-base mt-4", {
                    "select-primary font-bold": type,
                })}
                onChange={(e) => setType(e.target.value)}
                value={type}
            >
                <option value={""} disabled>
                    Typ rozhledny *
                </option>
                {towerType.map((type) => (
                    <option key={type} value={type}>
                        {type}
                    </option>
                ))}
            </select>

            <div className="block md:flex gap-4">
                <select
                    className={cn("select select-bordered w-full text-sm sm:text-base mt-4", {
                        "select-primary font-bold": country,
                    })}
                    onChange={(e) => setCountry(e.target.value as CountryCode)}
                    value={country}
                >
                    <option value={""} disabled>
                        Stát *
                    </option>
                    {COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code}>
                            {country.emoji} {country.name}
                        </option>
                    ))}
                </select>

                <select
                    className={cn("select select-bordered w-full text-sm sm:text-base mt-4", {
                        "select-primary font-bold": province,
                    })}
                    onChange={(e) => setProvince(e.target.value)}
                    value={province}
                    disabled={country === ""}
                >
                    <option value={""} disabled>
                        Kraj
                    </option>
                    {country &&
                        getAllCountryProvinces(country).map((province) => (
                            <option key={province.code} value={province.code}>
                                {province.name}
                            </option>
                        ))}
                </select>

                <select
                    className={cn("select select-bordered w-full text-sm sm:text-base mt-4", {
                        "select-primary font-bold": county,
                    })}
                    onChange={(e) => setCounty(e.target.value)}
                    value={county}
                    disabled={province === ""}
                >
                    <option value={""} disabled>
                        Okres
                    </option>
                    {country &&
                        getAllCountiesFromCountryProvince(country, province).map((county) => (
                            <option key={county} value={county}>
                                {county}
                            </option>
                        ))}
                </select>
            </div>

            <h2 className="text-lg mt-6">Pozice na mapě</h2>

            <div className="rounded-xl overflow-hidden mt-2">
                <MapPicker pickedPosition={pickedPosition} setPickedPosition={setPickedPosition} />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div>
                    <button className="btn btn-primary w-60" onClick={parsePositionFromClipboard}>
                        Vložit GPS ze schránky
                    </button>
                    {clipboardError && <div className="text-error text-sm mt-1">{clipboardError}</div>}
                </div>
                <label className={cn("input input-bordered flex items-center gap-2 whitespace-nowrap text-sm sm:text-base w-full", {})}>
                    Latitude:
                    <input className="w-full" type="text" defaultValue={pickedPosition?.latitude.toFixed(8) ?? ""} disabled />
                </label>

                <label className={cn("input input-bordered flex items-center gap-2 whitespace-nowrap text-sm sm:text-base w-full", {})}>
                    Longitude:
                    <input className="w-full" type="text" defaultValue={pickedPosition?.longitude.toFixed(8) ?? ""} disabled />
                </label>

                <label className={cn("input input-bordered flex items-center gap-2 whitespace-nowrap text-sm sm:text-base w-full", {})}>
                    GPS hash:
                    <input className="w-full" type="text" disabled />
                </label>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="card card-compact sm:card-normal card-bordered shadow-md mt-4 w-full">
                    <div className="card-body">
                        <div className="card-title">Parametry</div>

                        <label className={cn("input input-bordered flex items-center gap-2 whitespace-nowrap text-sm sm:text-base mt-4", {})}>
                            Výška stavby (m):
                            <input className="w-full" type="number" />
                        </label>

                        <label className={cn("input input-bordered flex items-center gap-2 whitespace-nowrap text-sm sm:text-base mt-4", {})}>
                            Výška výhledu (m):
                            <input className="w-full" type="number" />
                        </label>

                        <label className={cn("input input-bordered flex items-center gap-2 whitespace-nowrap text-sm sm:text-base mt-4", {})}>
                            Počet vyhlídkových plošin:
                            <input className="w-full" type="number" />
                        </label>

                        <label className={cn("input input-bordered flex items-center gap-2 whitespace-nowrap text-sm sm:text-base mt-4", {})}>
                            Nadmořská výška (m):
                            <input className="w-full" type="number" />
                        </label>

                        <label className={cn("input input-bordered flex items-center gap-2 whitespace-nowrap text-sm sm:text-base mt-4", {})}>
                            Počet schodů:
                            <input className="w-full" type="number" />
                        </label>

                        <label className={cn("input input-bordered flex items-center gap-2 whitespace-nowrap text-sm sm:text-base mt-4", {})}>
                            Datum zpřístupnění:
                            <input className="w-full" type="date" />
                        </label>

                        <label className={cn("input input-bordered flex items-center gap-2 whitespace-nowrap text-sm sm:text-base mt-4", {})}>
                            Vlastník rozhledny:
                            <input className="w-full" type="text" />
                        </label>

                        <div>
                            <div className="card-title mt-4">Materiál</div>

                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1">
                                {materials.map((m) => (
                                    <label className="label cursor-pointer justify-start gap-1" key={m}>
                                        <input type="checkbox" className="checkbox" />
                                        <span className="label-text">{m}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card card-compact sm:card-normal card-bordered shadow-md mt-4 w-full">
                    <div className="card-body">
                        <div className="card-title">Podrobnosti</div>

                        <div>
                            <div className="grid grid-cols-2">
                                <label className="label cursor-pointer justify-start gap-1">
                                    <input type="checkbox" className="checkbox" />
                                    <span className="label-text">Dalekohled k dispozici</span>
                                </label>

                                <label className="label cursor-pointer justify-start gap-1">
                                    <input type="checkbox" className="checkbox" />
                                    <span className="label-text">Výhledové popisné tabule</span>
                                </label>

                                <label className="label cursor-pointer justify-start gap-1">
                                    <input type="checkbox" className="checkbox" />
                                    <span className="label-text">Rozcestník v blízkosti</span>
                                </label>
                            </div>

                            <div className="divider">Dostupnost</div>
                            <div className="grid grid-cols-2">
                                <label className="label cursor-pointer justify-start gap-1">
                                    <input type="checkbox" className="checkbox" />
                                    <span className="label-text">Nutné zapůjčit klíč</span>
                                </label>

                                <label className="label cursor-pointer justify-start gap-1">
                                    <input type="checkbox" className="checkbox" />
                                    <span className="label-text">Nutné domluvit návštěvu předem</span>
                                </label>

                                <label className="label cursor-pointer justify-start gap-1">
                                    <input type="checkbox" className="checkbox" />
                                    <span className="label-text">Vhodné i pro cyklisty</span>
                                </label>

                                <label className="label cursor-pointer justify-start gap-1">
                                    <input type="checkbox" className="checkbox" />
                                    <span className="label-text">Parkoviště u rozhledny</span>
                                </label>

                                <label className="label cursor-pointer justify-start gap-1">
                                    <input type="checkbox" className="checkbox" />
                                    <span className="label-text">Bezbariérový přístup</span>
                                </label>
                            </div>

                            <div className="divider">Zázemí</div>

                            <div className="grid grid-cols-2">
                                <label className="label cursor-pointer justify-start gap-1">
                                    <input type="checkbox" className="checkbox" />
                                    <span className="label-text">Toaleta</span>
                                </label>

                                <label className="label cursor-pointer justify-start gap-1">
                                    <input type="checkbox" className="checkbox" />
                                    <span className="label-text">Drobné občerstvení</span>
                                </label>

                                <label className="label cursor-pointer justify-start gap-1">
                                    <input type="checkbox" className="checkbox" />
                                    <span className="label-text">Restaurace</span>
                                </label>

                                <label className="label cursor-pointer justify-start gap-1">
                                    <input type="checkbox" className="checkbox" />
                                    <span className="label-text">Wifi</span>
                                </label>

                                <label className="label cursor-pointer justify-start gap-1">
                                    <input type="checkbox" className="checkbox" />
                                    <span className="label-text">Možnost platit kartou</span>
                                </label>

                                <label className="label cursor-pointer justify-start gap-1">
                                    <input type="checkbox" className="checkbox" />
                                    <span className="label-text">Přístřešek</span>
                                </label>

                                <label className="label cursor-pointer justify-start gap-1">
                                    <input type="checkbox" className="checkbox" />
                                    <span className="label-text">Opravný stojan na kolo</span>
                                </label>

                                <label className="label cursor-pointer justify-start gap-1">
                                    <input type="checkbox" className="checkbox" />
                                    <span className="label-text">Nabíječka pro elektrické prostředky</span>
                                </label>
                            </div>

                            <div className="divider">Bezpečnost</div>

                            <div className="grid grid-cols-2">
                                <label className="label cursor-pointer justify-start gap-1">
                                    <input type="checkbox" className="checkbox" />
                                    <span className="label-text">Kluzké povrchy</span>
                                </label>

                                <label className="label cursor-pointer justify-start gap-1">
                                    <input type="checkbox" className="checkbox" />
                                    <span className="label-text">Příkré schody</span>
                                </label>

                                <label className="label cursor-pointer justify-start gap-1">
                                    <input type="checkbox" className="checkbox" />
                                    <span className="label-text">Nízké zábradlí</span>
                                </label>

                                <label className="label cursor-pointer justify-start gap-1">
                                    <input type="checkbox" className="checkbox" />
                                    <span className="label-text">Výstup po žebříku</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTowerPage;
