import { ResponseError } from '../error/response-error';
import prisma from '../prisma';
import bcrypt from 'bcrypt';
import {
  AddUserReq,
  toAddUserRes,
  UpdateAccountUserReq,
  toUpdateAccountUserRes,
  GetUserReq,
  toUserRes,
  UpdateUserToNotVerifiedAndPasswordReq,
  UpdateImageUserReq,
} from '../../models/user.model';

export class UserService {
  static async addUser(req: AddUserReq) {
    const existingEmail = await prisma.user.findUnique({
      where: {
        email: req.email,
      },
    });

    if (existingEmail) {
      throw new ResponseError(400, 'Email already exist!');
    }

    req.password
      ? (req.password = await bcrypt.hash(req.password, 10))
      : (req.password = null);

    if (req.provider) {
      req.isVerified = true;
    } else {
      req.provider = null;
      req.image = null;
      req.isVerified = false;
    }

    const user = await prisma.user.create({
      data: req,
    });

    return toAddUserRes(user);
  }

  static async updateAccountUser(id: string, req: UpdateAccountUserReq) {
    const existingAccount = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingAccount) {
      throw new ResponseError(404, 'Account is not exist!');
    }

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: req,
    });

    return toUpdateAccountUserRes(user);
  }

  static async getUserByEmail(req: GetUserReq) {
    const user = await prisma.user.findUnique({
      where: {
        email: req.email,
      },
    });

    if (!user) throw new ResponseError(404, 'Email or password is wrong!');

    if (!req.password && user.password)
      throw new ResponseError(400, 'Email or password is wrong!');

    if (req.password && !user.password)
      throw new ResponseError(400, 'Your account is registered using Google. Please sign in with Google.')

    if (req.password && user.password) {
      const isPasswordValid = await bcrypt.compare(req.password, user.password);

      if (!isPasswordValid)
        throw new ResponseError(404, 'Email or password is wrong!');
    }

    return toUserRes(user);
  }

  static async verificationUser(req: { email: string }) {
    await prisma.user.update({
      where: {
        email: req.email,
      },
      data: {
        isVerified: true,
      },
    });
  }

  static async verifyUserByEmail(req: { email: string }) {
    const user = await prisma.user.findUnique({
      where: {
        email: req.email,
      },
    });

    if (!user) throw new ResponseError(404, 'User is not exist.');
  }

  static async verifyUserById(req: { id: string }) {
    const user = await prisma.user.findUnique({
      where: {
        id: req.id,
      },
    });

    if (!user) throw new ResponseError(404, 'User is not exist.');
  }

  static async verifyUserCredentialByEmail(req: { email: string }) {
    const user = await prisma.user.findUnique({
      where: {
        email: req.email,
      },
    });

    if (user?.provider === 'google')
      throw new ResponseError(401, 'User is google provider.');
  }

  static async getAccountUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new ResponseError(404, 'Id is wrong!');

    return toUpdateAccountUserRes(user);
  }

  static async changeUserToNotVerifiedByEmail(req: { email: string }) {
    await prisma.user.update({
      where: {
        email: req.email,
      },
      data: {
        isVerified: false,
      },
    });
  }

  static async changeUserPasswordByEmail(
    req: UpdateUserToNotVerifiedAndPasswordReq,
  ) {
    const password = await bcrypt.hash(req.password, 10);

    await prisma.user.update({
      where: {
        email: req.email,
      },
      data: {
        password,
      },
    });
  }

  static async updateImageUser(req: UpdateImageUserReq) {
    const user = await prisma.user.update({
      where: {
        email: req.email,
      },
      data: {
        image: req.image,
      },
    });

    return toUserRes(user);
  }
}
