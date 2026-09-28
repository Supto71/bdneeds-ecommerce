import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "facebook") {
        if (!user.email) return false;

        let dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || `${account.provider} User`,
              password: "OAUTH_LOGIN_" + Math.random().toString(36), // Dummy password for OAuth users
              avatarUrl: user.image || "",
              phone: "",
            },
          });
        }
        return true;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        // Initial sign in
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });
        if (dbUser) {
          token.dbUser = dbUser;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.dbUser) {
        (session as any).user.dbUser = token.dbUser;
      } else if (session?.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
        if (dbUser) {
          (session as any).user.dbUser = dbUser;
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_key_change_in_prod",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
