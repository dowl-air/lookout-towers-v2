import "server-only";

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const { privateKey } = JSON.parse(process.env.GOOGLE_PRIVATE_KEY);

if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.GOOGLE_PROJECTID,
            clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
            privateKey: privateKey,
        }),
    });
}

export const db = getFirestore();
