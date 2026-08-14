import type { NextAuthConfig } from "next-auth";

// Edge-safe config (no Prisma, no bcrypt) — used directly by middleware.
// The full config with the Credentials provider lives in auth.ts (Node-only).
export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      const path = nextUrl.pathname;

      const isPublic =
        path === "/" ||
        path === "/login" ||
        path === "/signup" ||
        path.startsWith("/p/");

      if (isPublic) return true;
      if (!isLoggedIn) return false;

      if (path.startsWith("/jobs")) {
        return role === "RECRUITER";
      }
      if (
        path.startsWith("/portfolio") ||
        path.startsWith("/discover") ||
        path.startsWith("/browse")
      ) {
        return role === "CANDIDATE";
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role: "CANDIDATE" | "RECRUITER" }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "CANDIDATE" | "RECRUITER";
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
