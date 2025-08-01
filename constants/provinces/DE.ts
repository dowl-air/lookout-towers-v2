const PROVINCES_DE = [
    {
        name: "Baden-Württemberg",
        shortName: "Baden-Württemberg",
        code: "BW",
        counties: [
            "Alb-Donau-Kreis",
            "Baden-Baden",
            "Biberach",
            "Böblingen",
            "Bodenseekreis",
            "Breisgau-Hochschwarzwald",
            "Calw",
            "Emmendingen",
            "Enzkreis",
            "Esslingen",
            "Freiburg im Breisgau",
            "Freudenstadt",
            "Göppingen",
            "Heidelberg",
            "Heidenheim",
            "Heilbronn",
            "Hohenlohekreis",
            "Karlsruhe",
            "Konstanz",
            "Lörrach",
            "Ludwigsburg",
            "Main-Tauber-Kreis",
            "Mannheim",
            "Neckar-Odenwald-Kreis",
            "Ortenaukreis",
            "Ostalbkreis",
            "Pforzheim",
            "Rastatt",
            "Ravensburg",
            "Rems-Murr-Kreis",
            "Reutlingen",
            "Rhein-Neckar-Kreis",
            "Rottweil",
            "Schwäbisch Hall",
            "Schwarzwald-Baar-Kreis",
            "Sigmaringen",
            "Stuttgart",
            "Tübingen",
            "Tuttlingen",
            "Ulm",
            "Waldshut",
            "Zollernalbkreis",
        ],
    },
    {
        name: "Bayern",
        shortName: "Bayern",
        code: "BY",
        counties: [
            "Aichach-Friedberg",
            "Altötting",
            "Amberg",
            "Amberg-Sulzbach",
            "Ansbach",
            "Aschaffenburg",
            "Augsburg",
            "Bad Kissingen",
            "Bad Tölz-Wolfratshausen",
            "Bamberg",
            "Bayreuth",
            "Berchtesgadener Land",
            "Cham",
            "Coburg",
            "Dachau",
            "Deggendorf",
            "Dillingen an der Donau",
            "Dingolfing-Landau",
            "Donau-Ries",
            "Ebersberg",
            "Eichstätt",
            "Erding",
            "Erlangen",
            "Erlangen-Höchstadt",
            "Forchheim",
            "Freising",
            "Freyung-Grafenau",
            "Fürstenfeldbruck",
            "Fürth",
            "Garmisch-Partenkirchen",
            "Günzburg",
            "Haßberge",
            "Hof",
            "Ingolstadt",
            "Kaufbeuren",
            "Kelheim",
            "Kempten",
            "Kitzingen",
            "Kronach",
            "Kulmbach",
            "Landsberg am Lech",
            "Landshut",
            "Lichtenfels",
            "Lindau",
            "Main-Spessart",
            "Memmingen",
            "Miesbach",
            "Miltenberg",
            "München",
            "Neuburg-Schrobenhausen",
            "Neumarkt in der Oberpfalz",
            "Neustadt an der Aisch-Bad Windsheim",
            "Neustadt an der Waldnaab",
            "New-Ulm",
            "Nürnberg",
            "Nürnberger Land",
            "Oberallgäu",
            "Ostallgäu",
            "Passau",
            "Pfaffenhofen an der Ilm",
            "Regen",
            "Regensburg",
            "Rhön-Grabfeld",
            "Rosenheim",
            "Roth",
            "Rottal-Inn",
            "Schwabach",
            "Schwandorf",
            "Schweinfurt",
            "Starnberg",
            "Straubing",
            "Straubing-Bogen",
            "Tirschenreuth",
            "Traunstein",
            "Unterallgäu",
            "Weiden in der Oberpfalz",
            "Weilheim-Schongau",
            "Weißenburg-Gunzenhausen",
            "Würzburg",
        ],
    },
    {
        name: "Berlin",
        shortName: "Berlin",
        code: "BE",
        counties: ["Berlin"],
    },
    {
        name: "Brandenburg",
        shortName: "Brandenburg",
        code: "BB",
        counties: [
            "Barnim",
            "Brandenburg an der Havel",
            "Cottbus",
            "Dahme-Spreewald",
            "Elbe-Elster",
            "Frankfurt (Oder)",
            "Havelland",
            "Märkisch-Oderland",
            "Oberhavel",
            "Oberspreewald-Lausitz",
            "Oder-Spree",
            "Ostprignitz-Ruppin",
            "Potsdam",
            "Potsdam-Mittelmark",
            "Prignitz",
            "Spree-Neiße",
            "Teltow-Fläming",
            "Uckermark",
        ],
    },
    {
        name: "Bremen",
        shortName: "Bremen",
        code: "HB",
        counties: ["Bremen", "Bremerhaven"],
    },
    {
        name: "Hamburg",
        shortName: "Hamburg",
        code: "HH",
        counties: ["Hamburg"],
    },
    {
        name: "Hessen",
        shortName: "Hessen",
        code: "HE",
        counties: [
            "Bergstraße",
            "Darmstadt",
            "Darmstadt-Dieburg",
            "Frankfurt am Main",
            "Fulda",
            "Gießen",
            "Groß-Gerau",
            "Hersfeld-Rotenburg",
            "Hochtaunuskreis",
            "Kassel",
            "Lahn-Dill-Kreis",
            "Limburg-Weilburg",
            "Main-Kinzig-Kreis",
            "Main-Taunus-Kreis",
            "Marburg-Biedenkopf",
            "Odenwaldkreis",
            "Offenbach",
            "Rheingau-Taunus-Kreis",
            "Schwalm-Eder-Kreis",
            "Vogelsbergkreis",
            "Waldeck-Frankenberg",
            "Werra-Meißner-Kreis",
            "Wetteraukreis",
            "Wiesbaden",
        ],
    },
    {
        name: "Mecklenburg-Vorpommern",
        shortName: "Mecklenburg-Vorpommern",
        code: "MV",
        counties: [
            "Landkreis Rostock",
            "Ludwigslust-Parchim",
            "Mecklenburgische Seenplatte",
            "Nordwestmecklenburg",
            "Rostock",
            "Schwerin",
            "Vorpommern-Greifswald",
            "Vorpommern-Rügen",
        ],
    },
    {
        name: "Niedersachsen",
        shortName: "Niedersachsen",
        code: "NI",
        counties: [
            "Ammerland",
            "Aurich",
            "Braunschweig",
            "Celle",
            "Cloppenburg",
            "Cuxhaven",
            "Delmenhorst",
            "Diepholz",
            "Emden",
            "Emsland",
            "Friesland",
            "Gifhorn",
            "Goslar",
            "Göttingen",
            "Grafschaft Bentheim",
            "Hameln-Pyrmont",
            "Hannover",
            "Harburg",
            "Heidekreis",
            "Helmstedt",
            "Hildesheim",
            "Holzminden",
            "Leer",
            "Lüchow-Dannenberg",
            "Lüneburg",
            "Nienburg",
            "Northeim",
            "Oldenburg",
            "Osnabrück",
            "Osterholz",
            "Peine",
            "Rotenburg",
            "Salzgitter",
            "Schaumburg",
            "Stade",
            "Uelzen",
            "Vechta",
            "Verden",
            "Wesermarsch",
            "Wilhelmshaven",
            "Wittmund",
            "Wolfenbüttel",
            "Wolfsburg",
        ],
    },
    {
        name: "Nordrhein-Westfalen",
        shortName: "Nordrhein-Westfalen",
        code: "NW",
        counties: [
            "Aachen",
            "Bielefeld",
            "Bochum",
            "Bonn",
            "Borken",
            "Bottrop",
            "Coesfeld",
            "Dortmund",
            "Duisburg",
            "Düren",
            "Düsseldorf",
            "Ennepe-Ruhr-Kreis",
            "Essen",
            "Euskirchen",
            "Gelsenkirchen",
            "Gütersloh",
            "Hagen",
            "Hamm",
            "Heinsberg",
            "Herford",
            "Herne",
            "Hochsauerlandkreis",
            "Höxter",
            "Kleve",
            "Köln",
            "Krefeld",
            "Leverkusen",
            "Lippe",
            "Märkischer Kreis",
            "Mettmann",
            "Minden-Lübbecke",
            "Mönchengladbach",
            "Mülheim an der Ruhr",
            "Münster",
            "Oberbergischer Kreis",
            "Oberhausen",
            "Olpe",
            "Paderborn",
            "Recklinghausen",
            "Remscheid",
            "Rhein-Erft-Kreis",
            "Rheinisch-Bergischer Kreis",
            "Rhein-Kreis Neuss",
            "Rhein-Sieg-Kreis",
            "Siegen-Wittgenstein",
            "Soest",
            "Solingen",
            "Steinfurt",
            "Unna",
            "Viersen",
            "Warendorf",
            "Wesel",
            "Wuppertal",
        ],
    },
    {
        name: "Rheinland-Pfalz",
        shortName: "Rheinland-Pfalz",
        code: "RP",
        counties: [
            "Ahrweiler",
            "Altenkirchen",
            "Alzey-Worms",
            "Bad Dürkheim",
            "Bad Kreuznach",
            "Bernkastel-Wittlich",
            "Birkenfeld",
            "Cochem-Zell",
            "Donnersbergkreis",
            "Eifelkreis Bitburg-Prüm",
            "Frankenthal",
            "Germersheim",
            "Kaiserslautern",
            "Koblenz",
            "Kusel",
            "Landau in der Pfalz",
            "Ludwigshafen am Rhein",
            "Mainz",
            "Mainz-Bingen",
            "Mayen-Koblenz",
            "Neustadt an der Weinstraße",
            "Neuwied",
            "Pirmasens",
            "Rhein-Hunsrück-Kreis",
            "Rhein-Lahn-Kreis",
            "Rhein-Pfalz-Kreis",
            "Speyer",
            "Südliche Weinstraße",
            "Südwestpfalz",
            "Trier",
            "Trier-Saarburg",
            "Vulkaneifel",
            "Westerwaldkreis",
            "Worms",
            "Zweibrücken",
        ],
    },
    {
        name: "Saarland",
        shortName: "Saarland",
        code: "SL",
        counties: ["Merzig-Wadern", "Neunkirchen", "Saarbrücken", "Saarlouis", "Saarpfalz-Kreis", "St. Wendel"],
    },
    {
        name: "Sachsen",
        shortName: "Sachsen",
        code: "SN",
        counties: [
            "Bautzen",
            "Chemnitz",
            "Dresden",
            "Erzgebirgskreis",
            "Görlitz",
            "Leipzig",
            "Meißen",
            "Mittelsachsen",
            "Nordsachsen",
            "Sächsische Schweiz-Osterzgebirge",
            "Vogtlandkreis",
            "Zwickau",
        ],
    },
    {
        name: "Sachsen-Anhalt",
        shortName: "Sachsen-Anhalt",
        code: "ST",
        counties: [
            "Altmarkkreis Salzwedel",
            "Anhalt-Bitterfeld",
            "Börde",
            "Burgenlandkreis",
            "Dessau-Roßlau",
            "Halle (Saale)",
            "Harz",
            "Jerichower Land",
            "Magdeburg",
            "Mansfeld-Südharz",
            "Saalekreis",
            "Salzlandkreis",
            "Stendal",
            "Wittenberg",
        ],
    },
    {
        name: "Schleswig-Holstein",
        shortName: "Schleswig-Holstein",
        code: "SH",
        counties: [
            "Dithmarschen",
            "Flensburg",
            "Herzogtum Lauenburg",
            "Kiel",
            "Lübeck",
            "Neumünster",
            "Nordfriesland",
            "Ostholstein",
            "Pinneberg",
            "Plön",
            "Rendsburg-Eckernförde",
            "Schleswig-Flensburg",
            "Segeberg",
            "Steinburg",
            "Stormarn",
        ],
    },
    {
        name: "Thüringen",
        shortName: "Thüringen",
        code: "TH",
        counties: [
            "Altenburger Land",
            "Eichsfeld",
            "Eisenach",
            "Erfurt",
            "Gera",
            "Gotha",
            "Greiz",
            "Hildburghausen",
            "Ilm-Kreis",
            "Jena",
            "Kyffhäuserkreis",
            "Nordhausen",
            "Saale-Holzland-Kreis",
            "Saale-Orla-Kreis",
            "Saalfeld-Rudolstadt",
            "Schmalkalden-Meiningen",
            "Sömmerda",
            "Sonneberg",
            "Suhl",
            "Unstrut-Hainich-Kreis",
            "Wartburgkreis",
            "Weimar",
            "Weimarer Land",
        ],
    },
];

export default PROVINCES_DE;

export const COUNTIES_DE = PROVINCES_DE.reduce((acc, province) => {
    return [...acc, ...province.counties];
}, []);
