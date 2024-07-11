import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { api } from './lib/axios';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider === 'google') {
        try {
          const isExistEmail = await api.post('users/by-email', {
            email: profile?.email,
          });

          if (!isExistEmail.data.data.provider) return false;

          return true;
        } catch (e) {
          const payload = {
            name: profile?.given_name + ' ' + profile?.family_name,
            email: profile?.email,
            provider: account.provider,
            image: profile?.picture,
            role: 'USER',
          };

          await api.post('users/', payload);

          return true;
        }
      }

      if (!user.isVerified) {
        await api.post('verification-token/', { email: user.email });
      }

      return true;
    },
    async session({ token, session }) {
      if (session.user) {
        session.user.id = token.sub as string
        session.user.role = token.role
        session.user.isVerified = token.isVerified
        session.user.provider = token.provider
        session.user.image = token.image
        session.user.accessToken = token.accessToken
      }

      return session;
    },
    async jwt({ token, user, account, profile, trigger, session }) {
      if (account?.provider === 'google') {
        const res = await api.post('users/by-email', { email: user.email });

        token.sub = res.data.data.id;
        token.isVerified = profile?.email_verified as boolean | undefined;
        token.role = "USER";
        token.provider = account.provider;
        token.image = profile?.picture;
        token.accessToken = res.data.data.accessToken;

        return token;
      }

      if (user) {
        token.role = user.role;
        token.isVerified = user.isVerified;
        token.provider = user.provider;
        token.image= user.image
        token.accessToken = user.accessToken;
      }

      if (trigger === 'update' && session) {
        token = { ...token, ...session };
        return token;
      }

      return token;
    },
  },
});
