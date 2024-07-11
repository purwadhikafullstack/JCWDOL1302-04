import { PropertyCategoryController } from "../controllers/propertyCategory.controller";
import { superAdminGuard, verifyToken } from "../middlewares/auth.middleware";
import { validatePostPropertyCategory } from "../validation/propertyCategory.validation";
import { Router } from "express";

export class PropertyCategoryRouter {
  private router: Router;
  private propertyCategoryController: PropertyCategoryController;

  constructor() {
    this.propertyCategoryController = new PropertyCategoryController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use(verifyToken, superAdminGuard);
    this.router.get(
      "/",
      this.propertyCategoryController.getPropertyCategory
    )
    this.router.post(
      "/",
      validatePostPropertyCategory,
      this.propertyCategoryController.postPropertyCategory
    );
    this.router.patch(
      "/:id",
      validatePostPropertyCategory,
      this.propertyCategoryController.patchPropertyCategory
    );
    this.router.delete(
      "/:id",
      this.propertyCategoryController.deletePropertyCategory
    )
  }

  getRouter(): Router {
    return this.router;
  }
}