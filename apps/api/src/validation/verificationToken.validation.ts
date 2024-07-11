import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const validatePostVerificationToken = [
  body('email').trim().isEmail().notEmpty().withMessage('Email is required'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({
        status: 'fail',
        message: errors.array()
      })
    }

    next();
  }
]