import { authOptions as AO } from "@/lib/authOptions";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";

const handler = NextAuth(AO)

export const authOptions : NextAuthOptions = AO

export { handler as GET, handler as POST }