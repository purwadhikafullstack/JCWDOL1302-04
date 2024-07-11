import { ResponseError } from '../error/response-error';
import { UserService } from '../services/user.service';
import { VerificationTokenService } from '../services/verificationToken.service';
import { NextFunction, Request, Response } from 'express';
import TokenManager from "../../lib/tokenManager";
import {
  AddUserReq,
  UpdateAccountUserReq,
  GetUserReq,
  UpdateUserToNotVerifiedAndPasswordReq,
  UpdateImageUserReq,
} from 'models/user.model';

export class UserController {
  async postUser(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as AddUserReq;

      const user = await UserService.addUser(request);

      res.status(201).send({
        data: user,
      });
    } catch (e) {
      next(e);
    }
  }

  async putAccountUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const request = req.body as UpdateAccountUserReq;

      const user = await UserService.updateAccountUser(id, request);

      res.status(201).send({
        data: user,
      });
    } catch (e) {
      next(e);
    }
  }

  async getUserByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as GetUserReq;

      const user = await UserService.getUserByEmail(request);
      const token = TokenManager.generateToken(user)

      res.status(200).send({
        data: { ...user, accessToken: token },
      });
    } catch (e) {
      next(e);
    }
  }

  async verificationUserByToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { token } = req.body as { token: string };

      const verificationToken =
        await VerificationTokenService.getVerificationTokenByToken({ token });

      await UserService.verificationUser({ email: verificationToken.email });

      await VerificationTokenService.deleteVerificationTokenById(
        verificationToken.id,
      );

      res.status(200).send({
        status: 'success',
      });
    } catch (e) {
      next(e);
    }
  }

  async getAccountUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const user = await UserService.getAccountUserById(id);

      res.status(200).send({
        data: user,
      });
    } catch (e) {
      next(e);
    }
  }

  async updateUserNotVerifiedAndPasswordByEmail(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const request = req.body as UpdateUserToNotVerifiedAndPasswordReq;

      await UserService.changeUserToNotVerifiedByEmail(request);

      await UserService.changeUserPasswordByEmail(request);

      // const verificationToken =
      //   await VerificationTokenService.addVerificationToken(request);

      // templateNodemailer(request.email, verificationToken.token);

      res.status(200).send({
        status: 'success',
      });
    } catch (e) {
      next(e);
    }
  }

  async patchImageUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { file } = req;

      if (file == undefined) {
        throw new ResponseError(404, 'Image is required');
      }

      const request = req.body as UpdateImageUserReq;
      request.image = file.filename;

      await UserService.verifyUserByEmail({ email: request.email });
      const user = await UserService.updateImageUser(request);

      res.status(200).send({
        status: 'success',
        data: user,
      });
    } catch (e) {
      next(e);
    }
  }

  async checkEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body as { email: string };

      await UserService.verifyUserByEmail({ email });

      await UserService.verifyUserCredentialByEmail({ email });

      res.status(200).send({
        status: 'success',
      });
    } catch (e) {
      next(e);
    }
  }
}
