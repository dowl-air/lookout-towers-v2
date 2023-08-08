const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

const TOWER_ID = "lkYyxlVrzEX0x0D8xH12";

// Replace with the path to your Firebase credentials file
const FIREBASE_CREDENTIALS_PATH = "./service_key.json";
const FIREBASE_STORAGE_BUCKET = "lookout-towers.appspot.com";

async function initializeFirebase() {
    const serviceAccount = require(FIREBASE_CREDENTIALS_PATH);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: FIREBASE_STORAGE_BUCKET,
    });
}

async function uploadFolderToFirebase(folderPath) {
    const bucket = admin.storage().bucket();
    const files = await fs.promises.readdir(folderPath);
    let counter = 1;
    for (const file of files) {
        const filename = `${TOWER_ID}_${counter}.jpg`;
        const filePath = path.join(folderPath, file);
        const destinationBlobName = "towers/" + TOWER_ID + "/" + filename;
        console.log(destinationBlobName);
        const blob = bucket.file(destinationBlobName);
        await blob.save(await fs.promises.readFile(filePath));
        await blob.makePublic();
        if (counter === 1) console.log(blob.publicUrl());
        counter += 1;
    }
}

async function main() {
    try {
        const folderPath = "/home/dowl/Downloads/" + TOWER_ID;
        await initializeFirebase();
        await uploadFolderToFirebase(folderPath);
    } catch (error) {
        console.error("Error uploading photos to Firebase Storage:", error);
    }
}

main();
