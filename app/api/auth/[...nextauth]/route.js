import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

const BACKEND_API = process.env.NEXT_PUBLIC_APP_API;

async function backendLogin({ email, password }) {
  const res = await fetch(`${BACKEND_API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "LOGIN_FAILED");
  return data;
}

async function backendGoogleAuth({ idToken }) {
  const res = await fetch(`${BACKEND_API}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "GOOGLE_LOGIN_FAILED");
  return data;
}

export const authOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;
          const data = await backendLogin({
            email: credentials.email,
            password: credentials.password,
          });
          if (!data?.token) return null;
          return {
            id: data.userId,
            userId: data.userId,
            email: data.email,
            accessToken: data.token,
          };
        } catch (_) {
          return null;
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Credentials provider signs in via `user`.
      if (user) {
        token.accessToken = user.accessToken;
        token.userId = user.userId;
        token.email = user.email;
        return token;
      }

      // Google provider: exchange id_token with nodejsapis to get our JWT.
      if (account?.provider === "google" && account?.id_token) {
        const data = await backendGoogleAuth({ idToken: account.id_token });
        token.accessToken = data.token;
        token.userId = data.userId;
        token.email = data.email;
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.userId) {
        session.user = { id: token.userId, email: token.email };
      }
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

