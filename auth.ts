import { FirestoreAdapter } from "@auth/firebase-adapter";
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import type { Provider } from "next-auth/providers"

import { authFirestore } from "@/utils/authFirestore";

const providers: Provider[] = [
    Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
]

export const providerMap = providers.map((provider) => {
    if (typeof provider === "function") {
        const providerData = provider()
        return { id: providerData.id, name: providerData.name }
    } else {
        return { id: provider.id, name: provider.name }
    }
})

export const { auth, handlers, signIn, signOut } = NextAuth({
    trustHost: true,
    providers,
    adapter: FirestoreAdapter(authFirestore),
    pages: {
        signIn: "/signin",
    },
})