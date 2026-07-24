"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { revalidateTowerByIDOrNameID } from "@/actions/cache/purge.tower.action";
import { uploadPhoto, uploadPhotoFromUrl } from "@/actions/photos/upload.action";
import { addTower } from "@/actions/towers/tower.add";
import { changeTowerMainPhoto } from "@/actions/towers/tower.change";
import {
    getReadyScrapedTowersAction,
    markScrapedTowerImported,
} from "@/actions/towers/towers.scraped.action";
import PhotosUpload from "@/components/add-tower/PhotosUpload";
import TagCheckbox from "@/components/add-tower/TagCheckbox";
import COUNTRIES, { CountryCode } from "@/constants/countries";
import { MATERIALS } from "@/constants/materials";
import { TowerTypeEnum, towerTypes } from "@/constants/towerType";
import { useNewTowerContext } from "@/context/NewTower";
import { AdmissionType } from "@/types/Admission";
import { ScrapedTower, Tower } from "@/types/Tower";
import { TowerTag } from "@/types/TowerTags";
import { cn } from "@/utils/cn";
import { toDateInputValue } from "@/utils/date";
import {
    findInfoByGPS,
    formatCountryName,
    getAllCountiesFromCountryProvince,
    getAllCountryProvinces,
} from "@/utils/geography";
import { mapScrapedTowerToForm } from "@/utils/scrapedTower";
import { getTowerValidationError } from "@/utils/towerValidation";

const MapPicker = dynamic(() => import("@/components/add-tower/MapPicker"), { ssr: false });

const AddTowerPage = () => {
    const { tower, updateTower, replaceTower, reset } = useNewTowerContext();
    const [photos, setPhotos] = useState<(File | string)[]>([]);
    const [mainIndex, setMainIndex] = useState<number>(0);
    const [scrapedTowers, setScrapedTowers] = useState<ScrapedTower[]>([]);
    const [scrapedTowerId, setScrapedTowerId] = useState("");
    const [scrapedTowersError, setScrapedTowersError] = useState("");
    const [openingHoursText, setOpeningHoursText] = useState("");
    const [tariffesText, setTariffesText] = useState("{}");
    const [structuredDataError, setStructuredDataError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
    const [uploadedPhotosCount, setUploadedPhotosCount] = useState(0);
    const contact = tower.contact ?? { email: "", officialWebsite: "", phone: "" };

    const [clipboardError, setClipboardError] = useState<string>("");
    const [gpsError, setGpsError] = useState<string>("");

    useEffect(() => {
        getReadyScrapedTowersAction()
            .then(setScrapedTowers)
            .catch(() => setScrapedTowersError("Nepodařilo se načíst nascrapované rozhledny."));
    }, []);

    const handleScrapedTowerSelect = (id: string) => {
        setScrapedTowerId(id);
        const scrapedTower = scrapedTowers.find((item) => item.id === id);

        setPhotos([]);
        setPhotos(scrapedTower.photos);
        setMainIndex(Math.max(scrapedTower.photos.indexOf(scrapedTower.mainPhotoUrl ?? ""), 0));
        setOpeningHoursText("");
        setTariffesText("{}");
        setStructuredDataError("");

        if (!scrapedTower) {
            reset();
            return;
        }

        replaceTower(mapScrapedTowerToForm(scrapedTower));
        setMainIndex(0);
        setOpeningHoursText(JSON.stringify(scrapedTower.openingHours ?? {}, null, 2));
        setTariffesText(JSON.stringify(scrapedTower.admission?.tariffes ?? {}, null, 2));
    };

    const updateOpeningHours = (value: string) => {
        setOpeningHoursText(value);

        try {
            updateTower({ openingHours: JSON.parse(value) });
            setStructuredDataError("");
        } catch {
            setStructuredDataError("Otevírací dobu je nutné zadat jako platný JSON objekt.");
        }
    };

    const updateAdmissionTariffes = (value: string) => {
        setTariffesText(value);

        try {
            updateTower({
                admission: {
                    tariffes: JSON.parse(value),
                    type: tower.admission?.type ?? AdmissionType.UNKNOWN,
                },
            });
            setStructuredDataError("");
        } catch {
            setStructuredDataError("Ceník vstupného je nutné zadat jako platný JSON objekt.");
        }
    };

    const handleFindInfoByGPS = async () => {
        if (!tower.gps) {
            setGpsError("GPS souřadnice nejsou k dispozici.");
            return;
        }

        const result = await findInfoByGPS({
            lat: tower.gps.latitude,
            lng: tower.gps.longitude,
        });
        if (!result) {
            setGpsError("Nepodařilo se najít informace podle GPS souřadnic.");
            return;
        }

        setGpsError("");

        updateTower({
            ...tower,
            name: result.name || tower.name,
            country: result.countryCode || tower.country,
            province: result.provinceCode || tower.province,
            county: result.county || tower.county,
        });
    };

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

    const handleSubmit = async () => {
        if (isSubmitting) return;

        if (structuredDataError) {
            alert(structuredDataError);
            return;
        }
        const validationError = getTowerValidationError(tower, photos.length);
        if (validationError) {
            alert(validationError);
            return;
        }

        setIsSubmitting(true);
        setIsUploadingPhotos(false);
        setUploadedPhotosCount(0);

        try {
            const newID = await addTower(tower as Tower);

            console.log("New tower ID:", newID);
            setIsUploadingPhotos(true);

            const uploadPromises = photos.map(async (photo, index) => {
                const publicURL =
                    photo instanceof File
                        ? await uploadPhoto(photo, newID, true, index === mainIndex)
                        : await uploadPhotoFromUrl(photo, newID, true, index === mainIndex);
                setUploadedPhotosCount((count) => count + 1);
                return publicURL;
            });
            const publicURLs = await Promise.all(uploadPromises);

            console.log("Uploaded photos:", publicURLs);

            await changeTowerMainPhoto(newID, publicURLs[mainIndex]);

            await revalidateTowerByIDOrNameID(newID);

            if (scrapedTowerId) {
                await markScrapedTowerImported(scrapedTowerId, newID);
            }

            alert("Rozhledna byla úspěšně přidána.");
            reset();
            setPhotos([]);
        } catch (error) {
            console.error("Unable to add tower:", error);
            alert("Rozhlednu se nepodařilo přidat. Zkuste to prosím znovu.");
        } finally {
            setIsSubmitting(false);
            setIsUploadingPhotos(false);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto mt-5 lg:mt-10 px-5 min-h-dvh">
            <article className="prose prose-sm lg:prose-base max-w-full">
                <h1 className="mb-2 md:mb-6 text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                    Přidat novou rozhlednu
                </h1>
                <p>
                    Můžete navrhnout přidání nové rozhledny do naší databáze. Čím více informací nám
                    poskytnete, tím lépe. Pomůžete nám i ostatním milovníkům rozhleden zlepšit naši
                    databázi.
                    <br /> Doporučujeme se předem přesvědčit, zda se rozhledna již nenachází v naší
                    databázi. V takovém případě nebude nová rozhledna přidána.
                </p>
            </article>

            <div className="card card-compact sm:card-normal card-bordered shadow-md mt-6">
                <div className="card-body">
                    <div className="card-title">Nascrapovaná rozhledna</div>
                    <p>
                        Výběr předvyplní formulář včetně fotografií. Všechny hodnoty lze před
                        odesláním upravit.
                    </p>
                    <select
                        className="select select-bordered w-full"
                        value={scrapedTowerId}
                        onChange={(event) => handleScrapedTowerSelect(event.target.value)}
                    >
                        <option value="">Vybrat nascrapovanou rozhlednu</option>
                        {scrapedTowers.map((scrapedTower) => (
                            <option key={scrapedTower.id} value={scrapedTower.id}>
                                {scrapedTower.name || scrapedTower.id}
                                {scrapedTower.county ? ` (${scrapedTower.county})` : ""}
                            </option>
                        ))}
                    </select>
                    {scrapedTowersError && (
                        <p className="text-error text-sm">{scrapedTowersError}</p>
                    )}
                </div>
            </div>

            <h2 className="text-lg mt-6">Základní údaje</h2>

            <label
                className={cn(
                    "input input-bordered flex items-center gap-2 whitespace-nowrap text-sm sm:text-base mt-4 w-full",
                    {
                        "input-primary": tower.name,
                    }
                )}
            >
                Název rozhledny *
                <input
                    type="text"
                    className="grow font-bold"
                    value={tower.name ?? ""}
                    onChange={(e) => updateTower({ name: e.target.value })}
                />
            </label>

            <select
                className={cn("select select-bordered w-full text-sm sm:text-base mt-4", {
                    "select-primary font-bold": tower.type,
                })}
                onChange={(e) => updateTower({ type: e.target.value as TowerTypeEnum })}
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
                            {country.emoji} {formatCountryName(country.code)}
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
                        getAllCountiesFromCountryProvince(
                            tower.country as CountryCode,
                            tower.province
                        ).map((county) => (
                            <option key={county} value={county}>
                                {county}
                            </option>
                        ))}
                </select>
            </div>

            <h2 className="text-lg mt-6">Pozice na mapě</h2>

            <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <div>
                    <button className="btn btn-primary w-60" onClick={parsePositionFromClipboard}>
                        Vložit GPS ze schránky
                    </button>
                    {clipboardError && (
                        <div className="text-error text-sm mt-1">{clipboardError}</div>
                    )}
                </div>
                <label
                    className={cn(
                        "input input-bordered flex items-center gap-2 whitespace-nowrap text-sm sm:text-base w-full",
                        {}
                    )}
                >
                    Latitude *
                    <input
                        className="w-full"
                        type="text"
                        defaultValue={tower.gps?.latitude.toFixed(8) ?? ""}
                        disabled
                    />
                </label>

                <label
                    className={cn(
                        "input input-bordered flex items-center gap-2 whitespace-nowrap text-sm sm:text-base w-full",
                        {}
                    )}
                >
                    Longitude *
                    <input
                        className="w-full"
                        type="text"
                        defaultValue={tower.gps?.longitude.toFixed(8) ?? ""}
                        disabled
                    />
                </label>

                <div>
                    <button className="btn btn-primary w-60" onClick={handleFindInfoByGPS}>
                        Zjistit základní údaje z GPS
                    </button>
                    {gpsError && <div className="text-error text-sm mt-1">{gpsError}</div>}
                </div>
            </div>

            <div className="rounded-xl overflow-hidden mt-4">
                <MapPicker
                    pickedPosition={tower.gps ?? null}
                    setPickedPosition={(gps) => updateTower({ gps: gps })}
                />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="card card-compact sm:card-normal card-bordered shadow-md mt-4 w-full">
                    <div className="card-body">
                        <div className="card-title">Parametry</div>

                        <label
                            className={cn(
                                "input input-bordered flex items-center gap-2 whitespace-nowrap text-sm sm:text-base mt-2 w-full",
                                {
                                    "input-primary font-bold": tower.height > -1,
                                }
                            )}
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
                            className={cn(
                                "input input-bordered flex items-center gap-2 whitespace-nowrap text-sm sm:text-base mt-4 w-full",
                                {
                                    "input-primary font-bold": tower.viewHeight > -1,
                                }
                            )}
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
                            className={cn(
                                "input input-bordered flex items-center gap-2 whitespace-nowrap text-sm sm:text-base mt-4 w-full",
                                {
                                    "input-primary font-bold": tower.observationDecksCount > -1,
                                }
                            )}
                        >
                            Počet vyhlídkových plošin:
                            <input
                                className="w-full"
                                type="number"
                                value={tower.observationDecksCount ?? ""}
                                onChange={(e) =>
                                    updateTower({ observationDecksCount: +e.target.value || 0 })
                                }
                            />
                        </label>

                        <label
                            className={cn(
                                "input input-bordered flex items-center gap-2 whitespace-nowrap text-sm sm:text-base mt-4 w-full",
                                {
                                    "input-primary font-bold": tower.elevation > -500,
                                }
                            )}
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
                            className={cn(
                                "input input-bordered flex items-center gap-2 whitespace-nowrap text-sm sm:text-base mt-4 w-full",
                                {
                                    "input-primary font-bold": tower.stairs > -1,
                                }
                            )}
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
                            className={cn(
                                "input input-bordered flex items-center gap-2 whitespace-nowrap text-sm sm:text-base mt-4 w-full",
                                {
                                    "input-primary font-bold": tower.opened,
                                }
                            )}
                        >
                            Datum zpřístupnění:
                            <input
                                className="w-full"
                                type="date"
                                value={toDateInputValue(tower.opened)}
                                onChange={(event) =>
                                    updateTower({
                                        opened: event.target.value
                                            ? new Date(event.target.value)
                                            : undefined,
                                    })
                                }
                            />
                        </label>

                        <label
                            className={cn(
                                "input input-bordered flex items-center gap-2 whitespace-nowrap text-sm sm:text-base mt-4 w-full",
                                {
                                    "input-primary font-bold": tower.owner,
                                }
                            )}
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
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                                {MATERIALS.map((m) => (
                                    <label
                                        className="label cursor-pointer justify-start gap-1"
                                        key={m}
                                    >
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                            checked={
                                                tower.material ? tower.material.includes(m) : false
                                            }
                                            onChange={(e) =>
                                                updateTower({
                                                    material: e.target.checked
                                                        ? [...(tower.material ?? []), m]
                                                        : tower.material?.filter(
                                                              (mat) => mat !== m
                                                          ),
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

                        <label className="form-control mt-2">
                            <span className="label-text">Alternativní názvy (jeden na řádek)</span>
                            <textarea
                                className="textarea textarea-bordered"
                                value={(tower.aliases ?? []).join("\n")}
                                onChange={(event) =>
                                    updateTower({
                                        aliases: event.target.value
                                            .split("\n")
                                            .map((alias) => alias.trim())
                                            .filter(Boolean),
                                    })
                                }
                            />
                        </label>

                        <div className="divider">Kontakt</div>
                        <input
                            className="input input-bordered w-full"
                            type="email"
                            placeholder="E-mail"
                            value={contact.email}
                            onChange={(event) =>
                                updateTower({
                                    contact: { ...contact, email: event.target.value },
                                })
                            }
                        />
                        <input
                            className="input input-bordered w-full mt-2"
                            type="tel"
                            placeholder="Telefon"
                            value={contact.phone}
                            onChange={(event) =>
                                updateTower({
                                    contact: { ...contact, phone: event.target.value },
                                })
                            }
                        />
                        <input
                            className="input input-bordered w-full mt-2"
                            type="url"
                            placeholder="Oficiální web"
                            value={contact.officialWebsite}
                            onChange={(event) =>
                                updateTower({
                                    contact: {
                                        ...contact,
                                        officialWebsite: event.target.value,
                                    },
                                })
                            }
                        />

                        <label className="form-control mt-4">
                            <span className="label-text">Odkazy (jeden na řádek)</span>
                            <textarea
                                className="textarea textarea-bordered"
                                value={(tower.urls ?? []).join("\n")}
                                onChange={(event) =>
                                    updateTower({
                                        urls: event.target.value
                                            .split("\n")
                                            .map((url) => url.trim())
                                            .filter(Boolean),
                                    })
                                }
                            />
                        </label>

                        <div className="divider">Vstupné a otevírací doba</div>
                        <select
                            className="select select-bordered w-full"
                            value={tower.admission?.type ?? AdmissionType.UNKNOWN}
                            onChange={(event) =>
                                updateTower({
                                    admission: {
                                        tariffes: tower.admission?.tariffes ?? {},
                                        type: event.target.value as AdmissionType,
                                    },
                                })
                            }
                        >
                            <option value={AdmissionType.UNKNOWN}>Neznámé</option>
                            <option value={AdmissionType.FREE}>Zdarma</option>
                            <option value={AdmissionType.PAID}>Placené</option>
                            <option value={AdmissionType.DONATION}>Dobrovolné</option>
                        </select>
                        <label className="form-control mt-2">
                            <span className="label-text">Ceník vstupného (JSON)</span>
                            <textarea
                                className="textarea textarea-bordered font-mono text-xs min-h-24"
                                value={tariffesText}
                                onChange={(event) => updateAdmissionTariffes(event.target.value)}
                            />
                        </label>
                        <label className="form-control mt-4">
                            <span className="label-text">
                                Otevírací doba (JSON model OpeningHours)
                            </span>
                            <textarea
                                className="textarea textarea-bordered font-mono text-xs min-h-36"
                                value={openingHoursText}
                                onChange={(event) => updateOpeningHours(event.target.value)}
                            />
                        </label>
                        {structuredDataError && (
                            <p className="text-error text-sm">{structuredDataError}</p>
                        )}

                        <div className="mt-2">
                            <div className="grid grid-cols-2 gap-2">
                                <TagCheckbox
                                    tower={tower}
                                    towerTag={TowerTag.HasTelescope}
                                    updateTower={updateTower}
                                    text="Dalekohled k dispozici"
                                />
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
                            <div className="grid grid-cols-2 gap-2">
                                <TagCheckbox
                                    tower={tower}
                                    towerTag={TowerTag.NeedToBorrowKey}
                                    updateTower={updateTower}
                                    text="Nutné zapůjčit klíč"
                                />
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
                                <TagCheckbox
                                    tower={tower}
                                    towerTag={TowerTag.HasParking}
                                    updateTower={updateTower}
                                    text="Parkoviště u rozhledny"
                                />
                                <TagCheckbox
                                    tower={tower}
                                    towerTag={TowerTag.WheelchairAccessible}
                                    updateTower={updateTower}
                                    text="Bezbariérový přístup"
                                />
                            </div>

                            <div className="divider">Zázemí</div>

                            <div className="grid grid-cols-2 gap-2">
                                <TagCheckbox
                                    tower={tower}
                                    towerTag={TowerTag.HasToilet}
                                    updateTower={updateTower}
                                    text="Toaleta"
                                />
                                <TagCheckbox
                                    tower={tower}
                                    towerTag={TowerTag.HasSnacks}
                                    updateTower={updateTower}
                                    text="Drobné občerstvení"
                                />
                                <TagCheckbox
                                    tower={tower}
                                    towerTag={TowerTag.HasRestaurant}
                                    updateTower={updateTower}
                                    text="Restaurace"
                                />
                                <TagCheckbox
                                    tower={tower}
                                    towerTag={TowerTag.HasWifi}
                                    updateTower={updateTower}
                                    text="Wifi"
                                />
                                <TagCheckbox
                                    tower={tower}
                                    towerTag={TowerTag.CanPayByCard}
                                    updateTower={updateTower}
                                    text="Možnost platit kartou"
                                />
                                <TagCheckbox
                                    tower={tower}
                                    towerTag={TowerTag.HasShelter}
                                    updateTower={updateTower}
                                    text="Přístřešek"
                                />
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

                            <div className="grid grid-cols-2 gap-2">
                                <TagCheckbox
                                    tower={tower}
                                    towerTag={TowerTag.HasSlipperySurface}
                                    updateTower={updateTower}
                                    text="Kluzké povrchy"
                                />
                                <TagCheckbox
                                    tower={tower}
                                    towerTag={TowerTag.HasSteepStairs}
                                    updateTower={updateTower}
                                    text="Příkré schody"
                                />
                                <TagCheckbox
                                    tower={tower}
                                    towerTag={TowerTag.HasSmallRailings}
                                    updateTower={updateTower}
                                    text="Nízké zábradlí"
                                />
                                <TagCheckbox
                                    tower={tower}
                                    towerTag={TowerTag.HasLadder}
                                    updateTower={updateTower}
                                    text="Výstup po žebříku"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="card card-compact sm:card-normal card-bordered shadow-md mt-4 w-full">
                    <div className="card-body">
                        <div className="card-title">Fotky</div>
                        <p className="mt-2">
                            Fotky můžete nahrát z počítače, nebo je vložit pomocí odkazu z webu.
                            Následně pomocí kliknutí označte hlavní fotografii, ve které by
                            rozhledna měla být vidět ideálně celá a měla by být umístěna uprostřed
                            fotografie.
                        </p>
                        <p className="mb-2">Je potřeba nahrát alespoň jednu fotografii.</p>
                        <PhotosUpload
                            photos={photos}
                            setPhotos={setPhotos}
                            setMainIndex={setMainIndex}
                            mainIndex={mainIndex}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-4 mb-6 justify-end">
                <button
                    className="btn btn-primary w-full sm:w-60"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                >
                    {isSubmitting && <span className="loading loading-spinner loading-sm" />}
                    {isSubmitting
                        ? isUploadingPhotos
                            ? `Nahrávání fotek ${uploadedPhotosCount}/${photos.length}`
                            : "Přidávání rozhledny"
                        : "Přidat rozhlednu"}
                </button>
            </div>
        </div>
    );
};

export default AddTowerPage;
