declare module 'next-auth' {
  interface User {
    id?: string | undefined,
    name?: string | null | undefined,
    email?: string | null | undefined,
    image?: string | null | undefined,
    role?: string,
    isVerified?: boolean,
    provider?: string | null | undefined,
    accessToken?: string | undefined
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string | null | undefined;
      role: string | undefined;
      isVerified: boolean | undefined;
      provider: string | null | undefined;
      accessToken: string | undefined;
    };
  }
}

import { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT {
    role: string | undefined;
    isVerified: boolean | undefined;
    provider: string | null | undefined;
    image: string | null | undefined;
    accessToken: string | undefined;
  }
}

import { NextAuthRequest } from 'next-auth/middleware';

declare module 'next-auth/middleware' {
  interface NextApiRequest {
    auth: {
      role: string | undefined;
    };
  }
}
