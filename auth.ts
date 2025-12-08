import { FirestoreAdapter } from "@auth/firebase-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import { updateTag } from "next/cache";

import { authFirestore } from "@/utils/authFirestore";
import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";
import Seznam from "@/utils/seznam.provider";
import { sendMail } from "@/actions/mail";

const providers: Provider[] = [
    Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Seznam({
        clientId: process.env.SEZNAM_CLIENT_ID,
        clientSecret: process.env.SEZNAM_CLIENT_SECRET,
    }),
];

export const providerMap = providers.map((provider) => {
    if (typeof provider === "function") {
        const providerData = provider();
        return { id: providerData.id, name: providerData.name };
    } else {
        return { id: provider.id, name: provider.name };
    }
});

export const { auth, handlers, signIn, signOut } = NextAuth({
    trustHost: true,
    providers,
    adapter: FirestoreAdapter(authFirestore),
    pages: {
        signIn: "/signin",
    },
    events: {
        async createUser(message) {
            await sendMail({
                subject: "[RS][Info] Nový uživatel",
                text: `Byl vytvořen nový uživatel s emailem ${message.user.email}`,
            });
            updateTag(CacheTag.UsersCount);
        },
        async updateUser(message) {
            updateTag(getCacheTagSpecific(CacheTag.User, message.user.id));
        },
    },
});
