import { initFirestore } from "@auth/firebase-adapter"
import { cert } from "firebase-admin/app"

const { privateKey } = JSON.parse(process.env.GOOGLE_PRIVATE_KEY);

export const authFirestore = initFirestore({
    credential: cert({
        projectId: process.env.GOOGLE_PROJECTID,
        clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
        privateKey: privateKey,
    }),
})