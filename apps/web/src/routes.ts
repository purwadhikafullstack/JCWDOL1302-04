export const userRoute: string[] = ['/property'];

export const userVerifiedRoute: string[] = ['/order'];

export const bothVerifiedRoute: string[] = ['/settings', '/profile'];

export const authRoute: string[] = ['/signup', '/signin', '/auth/error'];

export const tenantRoute = '/tenant';

export const tenantVerifiedRoute = ['/tenant/property', '/tenant/room-availability', '/tenant/special-price', '/tenant/order']

export const verificationRoute = '/verification';

export const DEFAULT_LOGIN_REDIRECT_AS_USER = '/';

export const DEFAULT_LOGIN_REDIRECT_AS_TENANT = '/tenant/dashboard';

export const superAdminRoute = ['/tenant/property-category']
