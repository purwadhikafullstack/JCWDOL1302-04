import { SignJWT } from 'jose'

const secret = new TextEncoder().encode(process.env.AUTH_SECRET)

export const generateAccessToken = async (session: any) => {
  return await new SignJWT(session.user)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(new Date(session.expires).getTime())
    .sign(secret);
}