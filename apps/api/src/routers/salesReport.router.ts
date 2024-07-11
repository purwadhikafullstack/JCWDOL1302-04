import { SalesReportController } from "../controllers/salesReport.contoller";
import { tenantGuard, verifyToken } from "../middlewares/auth.middleware";
import { Router } from "express";

export class SalesReportRouter {
  private router: Router;
  private salesReportController: SalesReportController;

  constructor() {
    this.salesReportController = new SalesReportController();
    this.router = Router();
    this.initializeRouters();
  }

  private initializeRouters(): void {
    this.router.use(verifyToken, tenantGuard);
    this.router.get(
      '/user/:userId',
      this.salesReportController.getSalesReportPropertiesByUserId
    );
  }

  getRouter(): Router {
    return this.router;
  }
}