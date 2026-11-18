import "server-only";

import { getServerSession, type NextAuthOptions } from "next-auth";
import { getToken } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { cache } from "react";
import { isRole, type Role, type Viewer } from "./auth-types";
import { Pj05Error, pj05Data } from "./pj05";

async function fetchViewer(token: string): Promise<Viewer> {
  const profile = await pj05Data<{
    _id?: unknown;
    name?: unknown;
    email?: unknown;
    role?: unknown;
  } | null>("auth/me", { token });

  if (
    typeof profile?._id !== "string" ||
    typeof profile.name !== "string" ||
    typeof profile.email !== "string" ||
    !isRole(profile.role)
  ) {
    throw new Pj05Error(502);
  }
  return {
    id: profile._id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
  };
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 2 * 60 * 60 },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      name: "PJ05",
      credentials: {
        email: { label: "อีเมล", type: "email" },
        password: { label: "รหัสผ่าน", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim();
        const password = credentials?.password;
        if (!email || !password) return null;

        try {
          const login = await pj05Data<{ token?: unknown } | null>(
            "auth/login",
            {
              method: "POST",
              body: { email, password },
            },
          );
          if (typeof login?.token !== "string" || !login.token) {
            throw new Pj05Error(502);
          }
          const viewer = await fetchViewer(login.token);
          return { ...viewer, backendToken: login.token };
        } catch (error) {
          if (error instanceof Pj05Error) {
            if (error.status === 400 || error.status === 401) return null;
            if (error.status === 429) throw new Error("RateLimited");
          }
          throw new Error("LoginUnavailable");
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.backendToken = user.backendToken;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub && isRole(token.role)) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

const readSessionToken = cache(async () => {
  const cookie = (await headers()).get("cookie");
  if (!cookie || !process.env.NEXTAUTH_SECRET) return null;

  const req = new NextRequest("http://localhost", { headers: { cookie } });
  return getToken({ req, secret: process.env.NEXTAUTH_SECRET });
});

export const getSessionViewer = cache(async (): Promise<Viewer | null> => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user?.id || !user.name || !user.email || !isRole(user.role)) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role };
});

// The token stays inside the server-only JWT and is never put in the session,
export const getViewer = cache(async () => {
  const [viewer, token] = await Promise.all([
    getSessionViewer(),
    readSessionToken(),
  ]);
  if (!viewer || !token?.backendToken || token.sub !== viewer.id) return null;
  return { viewer, backendToken: token.backendToken };
});

export function loginPath(next: string) {
  return `/login?next=${encodeURIComponent(next)}`;
}

export async function requireViewer(next: string, role?: Role) {
  const account = await getViewer();
  if (!account) redirect(loginPath(next));
  if (role && account.viewer.role !== role) redirect("/forbidden");
  return account;
}
