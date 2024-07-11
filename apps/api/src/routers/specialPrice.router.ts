import { SpecialPriceController } from "../controllers/specialPrice.controller";
import { tenantGuard, verifyToken } from "../middlewares/auth.middleware";
import { validatePatchSpecialPrice, validatePostSpecialPrice } from "../validation/specialPrice.validation";
import { Router } from "express";

export class SpecialPriceRouter {
  private router: Router;
  private specialPriceController: SpecialPriceController;

  constructor() {
    this.specialPriceController = new SpecialPriceController();
    this.router = Router();
    this.initializeRouters();
  }

  private initializeRouters(): void {
    this.router.use(verifyToken, tenantGuard);
    this.router.get(
      '/:userId',
      this.specialPriceController.getSpecialPricesByUserId
    );
    this.router.post(
      '/',
      validatePostSpecialPrice,
      this.specialPriceController.postSpecialPrice
    );
    this.router.patch(
      '/:id',
      validatePatchSpecialPrice,
      this.specialPriceController.patchSpecialPriceById
    );
    this.router.delete(
      '/:id',
      this.specialPriceController.deleteSpecialPriceById
    )
  }

  getRouter(): Router {
    return this.router;
  }
}