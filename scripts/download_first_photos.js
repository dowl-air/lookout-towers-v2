const admin = require("firebase-admin");
const serviceAccount = require("./service_key.json"); // Replace with your service account key
const fs = require("fs");
const path = require("path");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "lookout-towers.appspot.com", // Replace with your storage bucket URL
});

const bucket = admin.storage().bucket();
const firestore = admin.firestore();

async function getIDS() {
    const towersSnap = await firestore.collection("towers").get();
    const towerIDS = [];
    towersSnap.forEach((doc) => {
        towerIDS.push(doc.id);
    });
    return towerIDS;
}

async function downloadFirstPhotoFromFolders(towerIDs) {
    try {
        for (const id of towerIDs) {
            const [files] = await bucket.getFiles({ prefix: `towers/${id}` });

            const destination = `./${files[0].name}`;

            // Create destination directory if it doesn't exist
            const dirPath = path.dirname(destination);
            fs.mkdirSync(dirPath, { recursive: true });

            await files[0].download({ destination });
            console.log(`Downloaded ${files[0].name} to ${destination}`);
        }

        console.log("Download completed.");
    } catch (error) {
        console.error("Error downloading files:", error);
    }
}
getIDS().then((r) => downloadFirstPhotoFromFolders(r));
