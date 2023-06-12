import GoogleProvider from "next-auth/providers/google"
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { cert } from "firebase-admin/app";

const { privateKey } = JSON.parse(process.env.GOOGLE_PRIVATE_KEY!);

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    adapter: FirestoreAdapter({
        credential: cert({
            projectId: process.env.GOOGLE_PROJECTID,
            clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
            privateKey: privateKey,
        }),
    }),
}