import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const validatePostReview = [
  body('orderId').trim().notEmpty().withMessage('Order Id is required'),
  body('point').trim().notEmpty().withMessage('Point is required'),
  body('comment').trim().notEmpty().withMessage('Comment is required'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({
        status: 'fail',
        message: errors.array(),
      });
    }

    next();
  },
];