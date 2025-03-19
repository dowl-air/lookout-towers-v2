"use client";

import TagCheckbox from "@/components/add-tower/TagCheckbox";
import COUNTRIES, { CountryCode } from "@/constants/countries";
import { MATERIALS } from "@/constants/materials";
import { towerTypes } from "@/constants/towerType";
import { useNewTowerContext } from "@/context/NewTower";
import { TowerTag } from "@/types/TowerTags";
import { cn } from "@/utils/cn";
import { getAllCountiesFromCountryProvince, getAllCountryProvinces } from "@/utils/geography";
import dynamic from "next/dynamic";
import { useState } from "react";

const MapPicker = dynamic(() => import("@/components/add-tower/MapPicker"), { ssr: false });

const AddTowerPage = () => {
    const { tower, updateTower } = useNewTowerContext();

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
            updateTower({ gps: { latitude, longitude } });
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
                    "input-primary": tower.name,
                })}
            >
                Název rozhledny *
                <input type="text" className="grow font-bold" value={tower.name ?? ""} onChange={(e) => updateTower({ name: e.target.value })} />
            </label>

            <select
                className={cn("select select-bordered w-full text-sm sm:text-base mt-4", {
                    "select-primary font-bold": tower.type,
                })}
                onChange={(e) => updateTower({ type: e.target.value })}
                value={tower.type ?? ""}
            >
                <option value={""} disabled>
                    Typ rozhledny *
                </option>
                {towerTypes.map(({ name, value }) => (
                    <option key={value} value={value}>
                        {name}
                    </option>
                ))}
            </select>

            <div className="block md:flex gap-4">
                <select
                    className={cn("select select-bordered w-full text-sm sm:text-base mt-4", {
                        "select-primary font-bold": tower.country,
                    })}
                    onChange={(e) => updateTower({ country: e.target.value })}
                    value={tower.country ?? ""}
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
                        "select-primary font-bold": tower.province,
                    })}
                    onChange={(e) => updateTower({ province: e.target.value })}
                    value={tower.province ?? ""}
                    disabled={!tower.country}
                >
                    <option value={""} disabled>
                        Kraj
                    </option>
                    {tower.country &&
                        getAllCountryProvinces(tower.country as CountryCode).map((province) => (
                            <option key={province.code} value={province.code}>
                                {province.name}
                            </option>
                        ))}
                </select>

                <select
                    className={cn("select select-bordered w-full text-sm sm:text-base mt-4", {
                        "select-primary font-bold": tower.county,
                    })}
                    onChange={(e) => updateTower({ county: e.target.value })}
                    value={tower.county ?? ""}
                    disabled={!tower.province}
                >
                    <option value={""} disabled>
                        Okres
                    </option>
                    {tower.country &&
                        tower.province &&
                        getAllCountiesFromCountryProvince(tower.country as CountryCode, tower.province).map((county) => (
                            <option key={county} value={county}>
                                {county}
                            </option>
                        ))}
                </select>
            </div>

            <h2 className="text-lg mt-6">Pozice na mapě</h2>

            <div className="rounded-xl overflow-hidden mt-2">
                <MapPicker pickedPosition={tower.gps ?? null} setPickedPosition={(gps) => updateTower({ gps: gps })} />
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
                    <input className="w-full" type="text" defaultValue={tower.gps?.latitude.toFixed(8) ?? ""} disabled />
                </label>

                <label className={cn("input input-bordered flex items-center gap-2 whitespace-nowrap text-sm sm:text-base w-full", {})}>
                    Longitude:
                    <input className="w-full" type="text" defaultValue={tower.gps?.longitude.toFixed(8) ?? ""} disabled />
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

                        <label
                            className={cn("input input-bordered flex items-center gap-2 whitespace-nowrap text-sm sm:text-base mt-4", {
                                "input-primary font-bold": tower.height > -1,
                            })}
                        >
                            Výška stavby (m):
                            <input
                                className="w-full"
                                type="number"
                                value={tower.height ?? ""}
                                onChange={(e) => updateTower({ height: +e.target.value || 0 })}
                            />
                        </label>

                        <label
                            className={cn("input input-bordered flex items-center gap-2 whitespace-nowrap text-sm sm:text-base mt-4", {
                                "input-primary font-bold": tower.viewHeight > -1,
                            })}
                        >
                            Výška výhledu (m):
                            <input
                                className="w-full"
                                type="number"
                                value={tower.viewHeight ?? ""}
                                onChange={(e) => updateTower({ viewHeight: +e.target.value || 0 })}
                            />
                        </label>

                        <label
                            className={cn("input input-bordered flex items-center gap-2 whitespace-nowrap text-sm sm:text-base mt-4", {
                                "input-primary font-bold": tower.observationDecksCount > -1,
                            })}
                        >
                            Počet vyhlídkových plošin:
                            <input
                                className="w-full"
                                type="number"
                                value={tower.observationDecksCount ?? ""}
                                onChange={(e) => updateTower({ observationDecksCount: +e.target.value || 0 })}
                            />
                        </label>

                        <label
                            className={cn("input input-bordered flex items-center gap-2 whitespace-nowrap text-sm sm:text-base mt-4", {
                                "input-primary font-bold": tower.elevation > -500,
                            })}
                        >
                            Nadmořská výška (m):
                            <input
                                className="w-full"
                                type="number"
                                value={tower.elevation ?? ""}
                                onChange={(e) => updateTower({ elevation: +e.target.value || 0 })}
                            />
                        </label>

                        <label
                            className={cn("input input-bordered flex items-center gap-2 whitespace-nowrap text-sm sm:text-base mt-4", {
                                "input-primary font-bold": tower.stairs > -1,
                            })}
                        >
                            Počet schodů:
                            <input
                                className="w-full"
                                type="number"
                                value={tower.stairs ?? ""}
                                onChange={(e) => updateTower({ stairs: +e.target.value || 0 })}
                            />
                        </label>

                        <label
                            className={cn("input input-bordered flex items-center gap-2 whitespace-nowrap text-sm sm:text-base mt-4", {
                                "input-primary font-bold": tower.opened,
                            })}
                        >
                            Datum zpřístupnění:
                            <input
                                className="w-full"
                                type="date"
                                value={tower.opened ? new Date(tower.opened).toISOString().split("T")[0] : ""}
                                onChange={(e) => updateTower({ opened: e.target.value })}
                            />
                        </label>

                        <label
                            className={cn("input input-bordered flex items-center gap-2 whitespace-nowrap text-sm sm:text-base mt-4", {
                                "input-primary font-bold": tower.owner,
                            })}
                        >
                            Vlastník rozhledny:
                            <input
                                className="w-full"
                                type="text"
                                value={tower.owner ?? ""}
                                onChange={(e) => updateTower({ owner: e.target.value })}
                            />
                        </label>

                        <div>
                            <div className="card-title mt-4">Materiál</div>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1">
                                {MATERIALS.map((m) => (
                                    <label className="label cursor-pointer justify-start gap-1" key={m}>
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                            checked={tower.material ? tower.material.includes(m) : false}
                                            onChange={(e) =>
                                                updateTower({
                                                    material: e.target.checked
                                                        ? [...(tower.material ?? []), m]
                                                        : tower.material?.filter((mat) => mat !== m),
                                                })
                                            }
                                        />
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
                                <TagCheckbox tower={tower} towerTag={TowerTag.HasTelescope} updateTower={updateTower} text="Dalekohled k dispozici" />
                                <TagCheckbox
                                    tower={tower}
                                    towerTag={TowerTag.HasObservationBoards}
                                    updateTower={updateTower}
                                    text="Výhledové popisné tabule"
                                />
                                <TagCheckbox
                                    tower={tower}
                                    towerTag={TowerTag.IsNearTouristGuide}
                                    updateTower={updateTower}
                                    text="Rozcestník v blízkosti"
                                />
                            </div>

                            <div className="divider">Dostupnost</div>
                            <div className="grid grid-cols-2">
                                <TagCheckbox tower={tower} towerTag={TowerTag.NeedToBorrowKey} updateTower={updateTower} text="Nutné zapůjčit klíč" />
                                <TagCheckbox
                                    tower={tower}
                                    towerTag={TowerTag.NeedToBookVisit}
                                    updateTower={updateTower}
                                    text="Nutné domluvit návštěvu předem"
                                />
                                <TagCheckbox
                                    tower={tower}
                                    towerTag={TowerTag.SuitableForCyclists}
                                    updateTower={updateTower}
                                    text="Vhodné i pro cyklisty"
                                />
                                <TagCheckbox tower={tower} towerTag={TowerTag.HasParking} updateTower={updateTower} text="Parkoviště u rozhledny" />
                                <TagCheckbox
                                    tower={tower}
                                    towerTag={TowerTag.WheelchairAccessible}
                                    updateTower={updateTower}
                                    text="Bezbariérový přístup"
                                />
                            </div>

                            <div className="divider">Zázemí</div>

                            <div className="grid grid-cols-2">
                                <TagCheckbox tower={tower} towerTag={TowerTag.HasToilet} updateTower={updateTower} text="Toaleta" />
                                <TagCheckbox tower={tower} towerTag={TowerTag.HasSnacks} updateTower={updateTower} text="Drobné občerstvení" />
                                <TagCheckbox tower={tower} towerTag={TowerTag.HasRestaurant} updateTower={updateTower} text="Restaurace" />
                                <TagCheckbox tower={tower} towerTag={TowerTag.HasWifi} updateTower={updateTower} text="Wifi" />
                                <TagCheckbox tower={tower} towerTag={TowerTag.CanPayByCard} updateTower={updateTower} text="Možnost platit kartou" />
                                <TagCheckbox tower={tower} towerTag={TowerTag.HasShelter} updateTower={updateTower} text="Přístřešek" />
                                <TagCheckbox
                                    tower={tower}
                                    towerTag={TowerTag.HasBikeRepairStation}
                                    updateTower={updateTower}
                                    text="Opravný stojan na kolo"
                                />
                                <TagCheckbox
                                    tower={tower}
                                    towerTag={TowerTag.HasElectricCharger}
                                    updateTower={updateTower}
                                    text="Nabíječka pro elektrické prostředky"
                                />
                            </div>

                            <div className="divider">Bezpečnost</div>

                            <div className="grid grid-cols-2">
                                <TagCheckbox tower={tower} towerTag={TowerTag.HasSlipperySurface} updateTower={updateTower} text="Kluzké povrchy" />
                                <TagCheckbox tower={tower} towerTag={TowerTag.HasSteepStairs} updateTower={updateTower} text="Příkré schody" />
                                <TagCheckbox tower={tower} towerTag={TowerTag.HasSmallRailings} updateTower={updateTower} text="Nízké zábradlí" />
                                <TagCheckbox tower={tower} towerTag={TowerTag.HasLadder} updateTower={updateTower} text="Výstup po žebříku" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="card card-compact sm:card-normal card-bordered shadow-md mt-4 w-full">
                    <div className="card-body">hello</div>
                </div>
            </div>
        </div>
    );
};

export default AddTowerPage;
