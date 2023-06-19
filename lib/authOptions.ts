import GoogleProvider from "next-auth/providers/google"
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { cert } from "firebase-admin/app";
import { NextAuthOptions } from "next-auth";

const { privateKey } = JSON.parse(process.env.GOOGLE_PRIVATE_KEY!);

export const authOptions: NextAuthOptions = {
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
    callbacks: {
        session: async ({ session, token} : {session: any, token: any}) => {
            console.log(token)
            if (session?.user) session.user.id = token.uid;
            return session;
        },
        jwt: async ({ user, token } : {user: any, token: any}) => {
            if (user) {
            token.uid = user.id;
        }
        return token;
        },
    },
    session: {
        strategy: "jwt"
    }
}