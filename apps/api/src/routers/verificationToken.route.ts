import { VerificationTokenController } from "../controllers/verificationToken.controller";
import { validatePostVerificationToken } from "../validation/verificationToken.validation";
import { Router } from 'express';

export class VerificationTokenRouter {
  private router: Router;
  private verificationTokenController: VerificationTokenController;

  constructor() {
    this.verificationTokenController = new VerificationTokenController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/',
      validatePostVerificationToken,
      this.verificationTokenController.postVerificationTokenByEmail
    )
  }

  getRouter(): Router {
    return this.router;
  }
}
