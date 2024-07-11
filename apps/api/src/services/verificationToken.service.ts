import { ResponseError } from "../error/response-error";
import prisma from "../prisma";
import { v4 as uuidv4 } from "uuid";

export class VerificationTokenService {
  static async addVerificationToken(req: { email: string }) {
    const token = `${uuidv4()}`;
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await this.getVerificationTokenByEmail({ email: req.email });

    if (existingToken) {
      await prisma.verificationToken.delete({
        where: {
          id: existingToken.id
        }
      })
    }

    const verificationToken = await prisma.verificationToken.create({
      data: {
        email: req.email,
        token,
        expires
      }
    })

    return verificationToken;
  }

  static async getVerificationTokenByEmail(req: { email: string }) {
    const data = await prisma.verificationToken.findUnique({
      where: {
        email: req.email
      }
    })

    return data;
  }

  static async getVerificationTokenByToken(req: { token: string }) {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        token: req.token
      }
    })

    if (!verificationToken) throw new ResponseError(404, "Verification token is not exist")

    if (new Date() > new Date(verificationToken?.expires!)) throw new ResponseError(403, "Verification Token has expired");

    return verificationToken;
  }

  static async deleteVerificationTokenById(id: string) {
    await prisma.verificationToken.delete({
      where: {
        id
      }
    })
  }
}