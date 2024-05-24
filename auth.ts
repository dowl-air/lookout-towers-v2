import { FirestoreAdapter } from "@auth/firebase-adapter";
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

import { authFirestore } from "./lib/authFirestore";

export const { auth, handlers, signIn, signOut } = NextAuth({
    trustHost: true,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    adapter: FirestoreAdapter(authFirestore)
})