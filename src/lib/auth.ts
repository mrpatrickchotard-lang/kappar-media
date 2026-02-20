import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Simple admin user - in production, use database
const ADMIN_USER = {
  id: "1",
  email: "admin@kappar.tv",
  // Password: kappar2026
  passwordHash: "$2a$10$YourHashHere",
  name: "Kappar Admin",
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Check email
        if (credentials.email !== ADMIN_USER.email) {
          return null;
        }

        // Verify password - simple check for demo
        // In production: bcrypt.compare(credentials.password, ADMIN_USER.passwordHash)
        if (credentials.password !== "kappar2026") {
          return null;
        }

        return {
          id: ADMIN_USER.id,
          email: ADMIN_USER.email,
          name: ADMIN_USER.name,
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
};
