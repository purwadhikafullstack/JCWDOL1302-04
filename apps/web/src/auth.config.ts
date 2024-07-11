import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { SigninSchema } from "./schemas/auth-schema";
import { api } from "./lib/axios";

export default {
  pages: {
    signIn: "/signin",
    error: "/auth/error"
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 3,
  },
  providers: [
    Google({
      authorization: {
        prompt: "consent",
        access_type: "offline",
        response_type: "code"
      },  
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = SigninSchema.safeParse(credentials);

        if (validatedFields.success) {
          const user = await api.post("users/by-email", validatedFields.data);

          return user.data.data
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
