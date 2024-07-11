import { OrderController } from '../controllers/order.controller';
import { tenantGuard, verifyToken } from '../middlewares/auth.middleware';
import { validateTenantUpdateBooking } from '../validation/transaction.validation';
import { Router } from 'express';

export class OrderRouter {
  private router: Router;
  private orderController: OrderController;

  constructor() {
    this.orderController = new OrderController();
    this.router = Router();
    this.initializeRouters();
  }

  private initializeRouters(): void {
    this.router.use(verifyToken);
    this.router.get('/detail/:orderId', this.orderController.getOrdersByClientOrderId)

    this.router.use(tenantGuard);
    this.router.get('/:userId', this.orderController.getOrdersByUserId);

    this.router.patch(
      '/cancel/:tId/:uId/:iId',
      validateTenantUpdateBooking,
      this.orderController.cancelBokingPropertyByTenant,
    );

    this.router.patch(
      '/accept/:tId/:uId/:iId',
      validateTenantUpdateBooking,
      this.orderController.acceptedBokingPropertyByTenant,
    );

    this.router.patch(
      '/reject/:tId/:uId/:iId',
      validateTenantUpdateBooking,
      this.orderController.rejectedBokingPropertyByTenant,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
