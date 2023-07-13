const admin = require("firebase-admin");
const serviceAccount = require("./service_key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://lookout-towers-default-rtdb.europe-west1.firebasedatabase.app",
});

const db = admin.firestore();
const towersRef = db.collection("towers");

enum OpeningHoursType {
    Unknown,
    NonStop,
    Occasionally,
    Hours,
    Forbidden
}

enum OpeningHoursForbiddenType {
    Reconstruction,
    Temporary,
    Gone
}

type OpeningHours = {
    type: OpeningHoursType;
    months?: number[];
    days?: number[];
    forbidden_type?: OpeningHoursForbiddenType;
    time_start?: number;
    time_end?: number;
    lunch_break?: boolean;
    lunch_start?: number;
    lunch_end?: number;
    note?: string;
}

const unknownObject: OpeningHours = {
    type: OpeningHoursType.Unknown
}

const freeObject: OpeningHours = {
    type: OpeningHoursType.NonStop
}

const goneObject : OpeningHours = {
    type: OpeningHoursType.Forbidden,
    forbidden_type: OpeningHoursForbiddenType.Gone
}

const generateNoteObject = (note: string): OpeningHours => {
    return {
        type: OpeningHoursType.Unknown,
        note: note
    }
}

towersRef.get().then((querySnapshot : any) => {
    querySnapshot.forEach(async (doc : any) => {
        const towerDoc = towersRef.doc(doc.id)
        const data = await towerDoc.get().then((e : any) => e.data())
        console.log("changing ", data.name)
        if (!data.openingHours) {
            await towerDoc.update({openingHours: unknownObject})
        } else {
            if (typeof data.openingHours === 'object') {
                return
            }
            if (data.openingHours === "neznámé") {
                await towerDoc.update({openingHours: unknownObject})
            }
            else if (data.openingHours === "volně přístupná") {
                await towerDoc.update({openingHours: freeObject})
            }
            else if (data.openingHours === "dlouhodobě uzavřena") {
                await towerDoc.update({openingHours: goneObject})
            }
            else {
                await towerDoc.update({openingHours: generateNoteObject(data.openingHours || "")})
            }
        }
    });
});




/* const dod = async (id: string) => {
    const towerDoc = towersRef.doc(id)
        const data = await towerDoc.get().then((e : any) => e.data())
        if (!data.openingHours) {
            await towerDoc.update({openingHours: unknownObject})
        } else {
            if ("type" in data.openingHours) {
                return
            }
            if (data.openingHours === "neznámé") {
                await towerDoc.update({openingHours: unknownObject})
            }
            else if (data.openingHours === "volně přístupná") {
                await towerDoc.update({openingHours: freeObject})
            }
            else if (data.openingHours === "dlouhodobě uzavřena") {
                await towerDoc.update({openingHours: goneObject})
            }
            else {
                await towerDoc.update({openingHours: generateNoteObject(data.openingHours || "")})
            }
        }
};

dod("fo9s2ELP7TtsD61xXM5e"); */
