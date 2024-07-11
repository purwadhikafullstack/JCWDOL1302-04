import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { auth as authSession } from './auth';

import {
  authRoute,
  bothVerifiedRoute,
  DEFAULT_LOGIN_REDIRECT_AS_USER,
  verificationRoute,
  tenantRoute,
  DEFAULT_LOGIN_REDIRECT_AS_TENANT,
  userRoute,
  superAdminRoute,
  tenantVerifiedRoute,
  userVerifiedRoute,
} from '@/routes';

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req) {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const session = await authSession();

  const isUserRoute = userRoute.filter((v) => nextUrl.pathname.startsWith(v));
  const isBothVerifiedRoute = bothVerifiedRoute.includes(nextUrl.pathname);
  const isAuthRoute = authRoute.includes(nextUrl.pathname);
  const isVerificationRoute = nextUrl.pathname.startsWith(verificationRoute);
  const isTenantRoute = nextUrl.pathname.startsWith(tenantRoute);
  const isSuperAdminRoute = superAdminRoute.includes(nextUrl.pathname);
  const isTenantVerifiedRoute = tenantVerifiedRoute.includes(nextUrl.pathname);
  const isUserVerifiedRoute = userVerifiedRoute.includes(nextUrl.pathname);

  if (
    isLoggedIn &&
    (session?.user.isVerified === true || session?.user.isVerified === false) &&
    session.user.role === 'TENANT' &&
    (isUserRoute.length > 0 || isAuthRoute || isSuperAdminRoute || isUserVerifiedRoute)
  ) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT_AS_TENANT, req.url));
  }

  if (
    isLoggedIn &&
    session?.user.isVerified === true &&
    (session.user.role === 'USER' || session.user.role === 'TENANT') &&
    (isVerificationRoute || isSuperAdminRoute)
  ) {
    if (session.user.role === 'TENANT')
      return Response.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT_AS_TENANT, req.url)
      );

    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT_AS_USER, req.url));
  }

  if (
    isLoggedIn &&
    session?.user.isVerified === false &&
    (isBothVerifiedRoute || isSuperAdminRoute || isTenantVerifiedRoute || isUserVerifiedRoute)
  ) {
    if (session.user.role === 'TENANT')
      return Response.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT_AS_TENANT, req.url)
      );
    
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT_AS_USER, req.url));
  }

  if (
    isLoggedIn &&
    (session?.user.isVerified === true || session?.user.isVerified === false) &&
    session.user.role === 'USER' &&
    (isTenantRoute || isAuthRoute || isSuperAdminRoute)
  ) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT_AS_USER, req.url));
  }

  if (
    !isLoggedIn &&
    (isBothVerifiedRoute || isVerificationRoute || isTenantRoute || isSuperAdminRoute || isUserVerifiedRoute)
  ) {
    return Response.redirect(new URL('/signin', req.url));
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
