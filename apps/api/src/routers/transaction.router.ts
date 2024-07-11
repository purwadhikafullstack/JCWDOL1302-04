import { TransactionController } from '../controllers/transaction.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import {
  validateAddBooking,
  validateGetBookings,
  validateUpdateBooking,
} from '../validation/transaction.validation';

import { Router } from 'express';

export class TransactionRouter {
  private router: Router;
  private transactionController: TransactionController;

  constructor() {
    this.transactionController = new TransactionController();

    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use(verifyToken);

    this.router.get(
      '/bookings/:uId',
      validateGetBookings,
      this.transactionController.getBokings,
    );

    this.router.get(
      '/booking/check/:uId/:iId',
      validateUpdateBooking,
      this.transactionController.checkBokingProperty,
    );

    this.router.patch(
      '/booking/cancel/:uId/:iId',
      validateUpdateBooking,
      this.transactionController.cancelBokingProperty,
    );

    this.router.post(
      '/booking',
      validateAddBooking,
      this.transactionController.addBoking,
    );

    this.router.post(
      '/checking',
      validateAddBooking,
      this.transactionController.checkBoking,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
