import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const validatePostRoomAvailability = [
  body('fromDate').trim().notEmpty().withMessage('From date is required'),
  body('toDate').trim().notEmpty().withMessage('To date is required'),
  body('roomId').trim().notEmpty().withMessage('Room id is required'),

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

export const validatePatchRoomAvailability = [
  body('fromDate').trim().notEmpty().withMessage('From date is required'),
  body('toDate').trim().notEmpty().withMessage('To date is required'),

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
