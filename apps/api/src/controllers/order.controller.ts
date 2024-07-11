import { OrderService } from '../services/order.service';
import { NextFunction, Request, Response } from 'express';

export class OrderController {
  async getOrdersByClientOrderId(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;

      const orders = await OrderService.getOrdersByClientOrderId(orderId);

      res.status(200).send({
        data: orders
      });
    } catch (e) {
      next(e);
    }
  }

  async getOrdersByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      const orders = await OrderService.getOrdersByUserId(userId);

      res.status(200).send({
        data: orders,
      });
    } catch (e) {
      next(e);
    }
  }

  async cancelBokingPropertyByTenant(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { tId: tenantId, uId: userId, iId: invoiceId } = req.params;

      const book = await OrderService.cancelOrder({
        userId,
        tenantId,
        invoiceId,
      });

      res.status(201).send({
        data: book,
      });
    } catch (e) {
      next(e);
    }
  }

  async acceptedBokingPropertyByTenant(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { tId: tenantId, uId: userId, iId: invoiceId } = req.params;

      const book = await OrderService.acceptOrder({
        userId,
        tenantId,
        invoiceId,
      });

      res.status(201).send({
        data: book,
      });
    } catch (e) {
      next(e);
    }
  }

  async rejectedBokingPropertyByTenant(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { tId: tenantId, uId: userId, iId: invoiceId } = req.params;

      const book = await OrderService.rejectOrder({
        userId,
        tenantId,
        invoiceId,
      });

      res.status(201).send({
        data: book,
      });
    } catch (e) {
      next(e);
    }
  }
}
