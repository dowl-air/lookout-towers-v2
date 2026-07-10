import assert from "node:assert/strict";
import test from "node:test";

import { TowerTypeEnum } from "@/constants/towerType";
import { AdmissionType } from "@/types/Admission";
import { OpeningHoursForbiddenType, OpeningHoursType } from "@/types/OpeningHours";
import { mapNominatimAddress } from "@/utils/geography";

import {
    createMapyComUrl,
    createNameID,
    extractMapyCzDetails,
    parseCliOptions,
    parseDetailHtml,
    parseGpsCoordinates,
    resolveGeography,
    resolveUniqueNameID,
    selectMainPhoto,
    selectRandomPhotos,
} from "./scrape_add_tower";

test("parseDetailHtml extracts Tower URLs and skips Mapy links", () => {
    const result = parseDetailHtml(`
        <section id="detail">
            <div class="content-typename">Rozhledna</div>
            <h1>  Rozhledna na Vrchu  </h1>
            <div class="content-link">
                <a href="https://example.cz">Oficiální web</a>
                <a href="https://mapy.cz/turisticka">Mapa</a>
                <a href="/nahlizenidokn/123">Katastr</a>
            </div>
            <div class="content-link">
                <a href="https://example.org/vstupne">Vstupné</a>
            </div>
        </section>
    `);

    assert.deepEqual(result, {
        admission: { tariffes: {}, type: AdmissionType.UNKNOWN },
        contact: { email: "", officialWebsite: "", phone: "" },
        gps: null,
        keyValues: [],
        name: "na Vrchu",
        openingHours: { type: OpeningHoursType.Unknown },
        photos: [],
        type: TowerTypeEnum.ROZHLEDNA,
        urls: ["https://example.cz", "https://example.org/vstupne"],
    });
});

test("parseDetailHtml maps admission and operator to Tower fields", () => {
    const result = parseDetailHtml(`
        <section id="detail">
            <div class="content-admission"><strong>Vstup:</strong> zpoplatněný</div>
            <div class="content-keyval"><table><tbody>
                <tr><td class="text">provozovatel:</td><td>Česká společnost ornitologická</td></tr>
            </tbody></table></div>
        </section>
    `);

    assert.deepEqual(result.admission, { tariffes: {}, type: AdmissionType.PAID });
    assert.equal(result.owner, "Česká společnost ornitologická");
    assert.deepEqual(result.keyValues, []);
});

test("parseDetailHtml maps inaccessible admission to permanently closed", () => {
    const result = parseDetailHtml(`
        <section id="detail"><div class="content-admission"><strong>Vstup:</strong> nepřístupný</div></section>
    `);

    assert.deepEqual(result.openingHours, {
        forbiddenType: OpeningHoursForbiddenType.Banned,
        type: OpeningHoursType.Forbidden,
    });
    assert.deepEqual(result.admission, { tariffes: {}, type: AdmissionType.UNKNOWN });
});

test("resolveGeography maps Nominatim results to project geography values", async () => {
    const geography = await resolveGeography(
        { latitude: 49.4519678, longitude: 17.5327275 },
        async () => ({
            countryCode: "CZ",
            county: "Přerov",
            name: "Rozhledna Římská věž",
            provinceCode: "OL",
        })
    );

    assert.deepEqual(geography, { country: "CZ", county: "Přerov", province: "OL" });
});

test("mapNominatimAddress recognizes Nominatim region and district fields", () => {
    assert.deepEqual(
        mapNominatimAddress({
            address: {
                country_code: "cz",
                district: "okres Přerov",
                region: "Olomoucký kraj",
            },
            name: "Římská věž",
            type: "tower",
        }),
        {
            countryCode: "CZ",
            county: "Přerov",
            name: "Římská věž",
            provinceCode: "OL",
        }
    );
});

test("selectRandomPhotos deduplicates full-size photo URLs and limits them to eight", () => {
    const photos = selectRandomPhotos(
        [
            "https://d34-a.sdn.cz/photo-a.jpeg?fl=res,,500,1",
            "https://d34-a.sdn.cz/photo-b.jpeg?fl=res,,500,1",
            "https://d34-a.sdn.cz/photo-a.jpeg?fl=res,,500,1",
            "https://d34-a.sdn.cz/photo-c.jpeg?fl=res,,500,1",
            "https://d34-a.sdn.cz/photo-d.jpeg?fl=res,,500,1",
            "https://d34-a.sdn.cz/photo-e.jpeg?fl=res,,500,1",
            "https://d34-a.sdn.cz/photo-f.jpeg?fl=res,,500,1",
            "https://d34-a.sdn.cz/photo-g.jpeg?fl=res,,500,1",
            "https://d34-a.sdn.cz/photo-h.jpeg?fl=res,,500,1",
            "https://d34-a.sdn.cz/photo-i.jpeg?fl=res,,500,1",
        ],
        () => 0
    );

    assert.equal(photos.length, 8);
    assert.equal(new Set(photos).size, 8);
    assert.ok(photos.every((photo) => photo.endsWith("?fl=res,2200,2200,1")));
});

test("selectMainPhoto selects one of the collected photos", () => {
    const photos = ["https://example.cz/first.jpeg", "https://example.cz/second.jpeg"];

    assert.equal(
        selectMainPhoto(photos, () => 0.9),
        "https://example.cz/second.jpeg"
    );
    assert.equal(
        selectMainPhoto([], () => 0),
        ""
    );
});

test("createNameID uses the existing tower nameID format", () => {
    assert.equal(createNameID("Římská věž"), "rimska_vez");
});

test("resolveUniqueNameID resolves collisions with county and numeric suffixes", async () => {
    const existingNameIDs = new Set(["rimska_vez", "rimska_vez_prerov"]);

    assert.equal(
        await resolveUniqueNameID("Římská věž", "Přerov", async (nameID) =>
            existingNameIDs.has(nameID)
        ),
        "rimska_vez_2"
    );
    assert.equal(await resolveUniqueNameID("Nová věž", "Přerov", async () => false), "nova_vez");
});

test("parseDetailHtml removes only a leading tower type from the name", () => {
    const cases = [
        ["Rozhledna Římská věž", "Římská věž"],
        ["Vyhlídková věž: Nový hrad", "Nový hrad"],
        ["Věž kostela sv. Jakuba", "kostela sv. Jakuba"],
        ["Hradní věž Rozhledna", "Hradní věž Rozhledna"],
    ];

    for (const [originalName, expectedName] of cases) {
        const result = parseDetailHtml(`<section id="detail"><h1>${originalName}</h1></section>`);

        assert.equal(result.name, expectedName);
    }
});

test("parseDetailHtml extracts contact information and puts official website first", () => {
    const result = parseDetailHtml(`
        <section id="detail">
            <div class="content-contact">
                <div class="contact-container phone"><span class="phone">+420 602&nbsp;320&nbsp;577</span></div>
                <div class="contact-container email"><a class="email" href="mailto:hradstaryjicin@email.cz">hradstaryjicin@email.cz</a></div>
                <div class="contact-container www"><a class="www" href="https://www.hradstaryjicin.cz/">www.hradstaryjicin.cz</a></div>
            </div>
            <div class="content-link"><a href="https://example.cz">Další zdroj</a></div>
        </section>
    `);

    assert.deepEqual(result.contact, {
        email: "hradstaryjicin@email.cz",
        officialWebsite: "https://www.hradstaryjicin.cz/",
        phone: "+420 602 320 577",
    });
    assert.deepEqual(result.urls, ["https://www.hradstaryjicin.cz/", "https://example.cz"]);
});

test("parseDetailHtml maps known tower attributes and preserves unknown key-values", () => {
    const result = parseDetailHtml(`
        <section id="detail">
            <div class="content-keyval">
                <table>
                    <tbody>
                        <tr><td class="text">výška:</td><td>15 m</td></tr>
                        <tr><td class="text">nadmořská výška:</td><td>301 m</td></tr>
                        <tr><td class="text">počet schodů:</td><td>72</td></tr>
                        <tr><td class="text">materiál:</td><td>konstrukční ocel, dřevo</td></tr>
                        <tr><td class="text">architekt:</td><td>Jan Novák</td></tr>
                    </tbody>
                </table>
                <div class="content-keyval-data-source"><a href="https://licence.mapy.cz/">Zdroje dat</a></div>
            </div>
        </section>
    `);

    assert.equal(result.height, 15);
    assert.equal(result.elevation, 301);
    assert.equal(result.stairs, 72);
    assert.deepEqual(result.material, ["kov", "dřevo"]);
    assert.deepEqual(result.keyValues, [{ label: "architekt", value: "Jan Novák" }]);
});

test("parseDetailHtml normalizes Mapy.com type and extracts description", () => {
    const result = parseDetailHtml(`
        <section id="detail">
            <div class="content-typename">Rozhledna</div>
            <div class="content-description"><span>Vodárenská věž byla upravena na rozhlednu.</span></div>
        </section>
    `);

    assert.equal(result.description, "Vodárenská věž byla upravena na rozhlednu.");
    assert.equal(result.type, TowerTypeEnum.ROZHLEDNA);
});

test("parseDetailHtml classifies building towers from their name and description", () => {
    const vodarenskaVez = parseDetailHtml(`
        <section id="detail">
            <div class="content-typename">Věž budovy s vyhlídkou</div>
            <h1>Věž v centru</h1>
            <div class="content-description">Bývalá vodárenská věž s vyhlídkou.</div>
        </section>
    `);
    const hradniVez = parseDetailHtml(`
        <section id="detail">
            <div class="content-typename">Věž budovy s vyhlídkou</div>
            <h1>Hradní věž Špilberk</h1>
        </section>
    `);
    const zameckaVez = parseDetailHtml(`
        <section id="detail">
            <div class="content-typename">Věž budovy s vyhlídkou</div>
            <h1>Zámecká věž</h1>
        </section>
    `);
    const kostelniVez = parseDetailHtml(`
        <section id="detail">
            <div class="content-typename">Věž budovy s vyhlídkou</div>
            <h1>Věž kostela sv. Jakuba</h1>
        </section>
    `);
    const radnicniVez = parseDetailHtml(`
        <section id="detail">
            <div class="content-typename">Věž budovy s vyhlídkou</div>
            <h1>Radniční věž</h1>
        </section>
    `);

    assert.equal(vodarenskaVez.type, TowerTypeEnum.VODARENSKA_VEZ);
    assert.equal(hradniVez.type, TowerTypeEnum.HRADNI_VEZ);
    assert.equal(zameckaVez.type, TowerTypeEnum.ZAMECKA_VEZ);
    assert.equal(kostelniVez.type, TowerTypeEnum.KOSTELNI_VEZ);
    assert.equal(radnicniVez.type, TowerTypeEnum.MESTSKA_VEZ);
});

test("parseDetailHtml normalizes wildlife observation towers", () => {
    const result = parseDetailHtml(`
        <section id="detail"><div class="content-typename">Pozorovatelna zvěře</div></section>
    `);

    assert.equal(result.type, TowerTypeEnum.POZOROVATELNA);
});

test("parseDetailHtml maps GPS and a year-round opening-hours table", () => {
    const result = parseDetailHtml(`
        <section id="detail">
            <div class="gps"><input value="49.5473142N, 17.7343561E"></div>
            <div class="content-opening expanded">
                <div class="opening-notes"><p class="note">Vstupy organizuje informační centrum.</p></div>
                <div class="season-cont">
                    <div class="season-title"><span>1. ledna – 31. prosince</span></div>
                    <div class="season active"><div class="table">
                        <div class="column"><div class="cell closed">Pondělí</div><div class="cell">Úterý</div><div class="cell">Středa</div><div class="cell">Čtvrtek</div><div class="cell">Pátek</div><div class="cell">Sobota</div><div class="cell">Neděle</div></div>
                        <div class="column hours"><div class="cell closed">zavřeno</div><div class="cell">9–16</div><div class="cell">9–16</div><div class="cell">9–16</div><div class="cell">9–16</div><div class="cell">9–16</div><div class="cell">9–16</div></div>
                    </div></div>
                </div>
            </div>
        </section>
    `);

    assert.deepEqual(result.gps, { latitude: 49.5473142, longitude: 17.7343561 });
    assert.deepEqual(result.openingHours, {
        ranges: [
            {
                dayFrom: 9,
                dayTo: 16,
                days: [1, 2, 3, 4, 5, 6],
                monthFrom: 0,
                monthTo: 11,
            },
        ],
        type: OpeningHoursType.EveryMonth,
    });
});

test("parseDetailHtml maps every season from a Mapy.com opening-hours dropdown", () => {
    const result = parseDetailHtml(`
        <section id="detail">
            <div class="content-opening">
                <div class="season-cont">
                    <div class="ui-dropdown">
                        <button class="ui-dropdown-option" data-value="0">1. ledna – 31. března</button>
                        <button class="ui-dropdown-option" data-value="1">1. dubna – 31. srpna</button>
                        <button class="ui-dropdown-option" data-value="2">1. září – 30. října</button>
                        <button class="ui-dropdown-option" data-value="3">31. října – 31. října</button>
                        <button class="ui-dropdown-option active" data-value="4">1. listopadu – 30. listopadu</button>
                        <button class="ui-dropdown-option" data-value="5">1. prosince – 31. prosince</button>
                    </div>
                    <div class="season"><div class="table"><div class="column"><div class="cell">Pondělí - Neděle</div></div><div class="column hours"><div class="cell">zavřeno</div></div></div></div>
                    <div class="season"><div class="table"><div class="column"><div class="cell">Pondělí</div><div class="cell">Úterý</div><div class="cell">Středa</div><div class="cell">Čtvrtek</div><div class="cell">Pátek</div><div class="cell">Sobota</div><div class="cell">Neděle</div></div><div class="column hours"><div class="cell">9–19</div><div class="cell">9–19</div><div class="cell">9–19</div><div class="cell">9–19</div><div class="cell">9–19</div><div class="cell">9–19</div><div class="cell">9–19</div></div></div></div>
                    <div class="season"><div class="table"><div class="column"><div class="cell closed">Pondělí</div><div class="cell closed">Úterý</div><div class="cell closed">Středa</div><div class="cell closed">Čtvrtek</div><div class="cell">Pátek</div><div class="cell">Sobota</div><div class="cell">Neděle</div></div><div class="column hours"><div class="cell closed">zavřeno</div><div class="cell closed">zavřeno</div><div class="cell closed">zavřeno</div><div class="cell closed">zavřeno</div><div class="cell">9–17</div><div class="cell">9–17</div><div class="cell">9–17</div></div></div></div>
                    <div class="season"><div class="table"><div class="column"><div class="cell">Pondělí - Neděle</div></div><div class="column hours"><div class="cell">zavřeno</div></div></div></div>
                    <div class="season"><div class="table"><div class="column"><div class="cell closed">Pondělí</div><div class="cell closed">Úterý</div><div class="cell closed">Středa</div><div class="cell closed">Čtvrtek</div><div class="cell">Pátek</div><div class="cell">Sobota</div><div class="cell">Neděle</div></div><div class="column hours"><div class="cell closed">zavřeno</div><div class="cell closed">zavřeno</div><div class="cell closed">zavřeno</div><div class="cell closed">zavřeno</div><div class="cell">9–16</div><div class="cell">9–16</div><div class="cell">9–16</div></div></div></div>
                    <div class="season"><div class="table"><div class="column"><div class="cell">Pondělí - Neděle</div></div><div class="column hours"><div class="cell">zavřeno</div></div></div></div>
                </div>
            </div>
        </section>
    `);

    assert.deepEqual(result.openingHours, {
        ranges: [
            { dayFrom: 9, dayTo: 19, days: [0, 1, 2, 3, 4, 5, 6], monthFrom: 3, monthTo: 7 },
            { dayFrom: 9, dayTo: 17, days: [4, 5, 6], monthFrom: 8, monthTo: 9 },
            { dayFrom: 9, dayTo: 16, days: [4, 5, 6], monthFrom: 10, monthTo: 10 },
        ],
        type: OpeningHoursType.SomeMonths,
    });
});

test("parseDetailHtml maps year-round nonstop access to free admission", () => {
    const result = parseDetailHtml(`
        <section id="detail">
            <div class="content-opening"><div class="season-cont">
                <div class="season-title"><span>1. ledna – 31. prosince</span></div>
                <div class="season"><div class="table">
                    <div class="column"><div class="cell">Pondělí</div><div class="cell">Úterý</div><div class="cell">Středa</div><div class="cell">Čtvrtek</div><div class="cell">Pátek</div><div class="cell">Sobota</div><div class="cell">Neděle</div></div>
                    <div class="column hours"><div class="cell">nonstop</div><div class="cell">nonstop</div><div class="cell">nonstop</div><div class="cell">nonstop</div><div class="cell">nonstop</div><div class="cell">nonstop</div><div class="cell">nonstop</div></div>
                </div></div>
            </div></div>
        </section>
    `);

    assert.deepEqual(result.openingHours, { type: OpeningHoursType.NonStop });
    assert.deepEqual(result.admission, { tariffes: {}, type: AdmissionType.FREE });
});

test("parseGpsCoordinates recognizes southern and western coordinates", () => {
    assert.deepEqual(parseGpsCoordinates("33.123S, 18.456W"), {
        latitude: -33.123,
        longitude: -18.456,
    });
});

test("parseDetailHtml maps opening by arrangement to Occasionally", () => {
    const result = parseDetailHtml(`
        <section id="detail">
            <div class="content-opening">
                <div class="opening-notes"><p class="note">Otevřeno jen po dohodě pro skupiny.</p></div>
            </div>
        </section>
    `);

    assert.deepEqual(result.openingHours, {
        detailText: "Otevřeno jen po dohodě pro skupiny.",
        type: OpeningHoursType.Occasionally,
    });
});

test("parseDetailHtml returns null fields when expected elements are missing", () => {
    assert.deepEqual(parseDetailHtml('<section id="detail"></section>'), {
        admission: { tariffes: {}, type: AdmissionType.UNKNOWN },
        contact: { email: "", officialWebsite: "", phone: "" },
        gps: null,
        keyValues: [],
        name: null,
        openingHours: { type: OpeningHoursType.Unknown },
        photos: [],
        type: null,
        urls: [],
    });
});

test("extractMapyCzDetails reads only source and ID from a resolved Mapy.cz URL", () => {
    assert.deepEqual(
        extractMapyCzDetails(
            "https://mapy.cz/turisticka?source=base&id=123456&foo=bar",
            "Rozhledna Římská věž"
        ),
        {
            id: "123456",
            name: "Rozhledna Římská věž",
            source: "base",
        }
    );
});

test("extractMapyCzDetails returns null identifiers when they are absent", () => {
    assert.deepEqual(extractMapyCzDetails("https://mapy.cz/turisticka?foo=bar"), {
        id: null,
        name: null,
        source: null,
    });
});

test("createMapyComUrl keeps only the required Mapy.com identifiers", () => {
    assert.equal(
        createMapyComUrl({ id: "2582164", source: "base" }),
        "https://mapy.com/cs/turisticka?source=base&id=2582164"
    );
    assert.equal(createMapyComUrl({ id: null, source: "base" }), null);
});

test("parseCliOptions accepts the pnpm argument separator before a URL", () => {
    assert.deepEqual(
        parseCliOptions(["--", "https://mapy.com/cs/turisticka?id=2582164&source=base"]),
        {
            outputPath: undefined,
            url: "https://mapy.com/cs/turisticka?id=2582164&source=base",
            waitTimeSeconds: 10,
        }
    );
});
