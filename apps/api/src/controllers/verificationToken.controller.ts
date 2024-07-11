import { UserService } from "../services/user.service";
import { VerificationTokenService } from "../services/verificationToken.service";
import { NextFunction, Request, Response } from "express";
import { templateNodemailer, transporter } from "../../lib/nodeMailer";

export class VerificationTokenController {
  async postVerificationTokenByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body as { email: string };

      await UserService.verifyUserByEmail({ email });

      const verificationToken = await VerificationTokenService.addVerificationToken({ email });

      templateNodemailer(email, verificationToken.token);

      res.status(201).send({
        data: verificationToken
      })
    } catch (e) {
      next(e)
    }
  }
}
