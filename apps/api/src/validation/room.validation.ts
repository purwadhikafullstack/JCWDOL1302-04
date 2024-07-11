import { NextFunction, Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';

export const validatGetRooms = [
  param('id').trim().notEmpty().withMessage('Id is required'),
  param('pId').trim().notEmpty().withMessage('Property Id is required'),

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

export const validatGetRoomDetail = [
  param('id').trim().notEmpty().withMessage('Id is required'),
  param('pId').trim().notEmpty().withMessage('Property Id is required'),
  param('rId').trim().notEmpty().withMessage('Room Id is required'),

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

export const validatAddRoom = [
  param('id').trim().notEmpty().withMessage('Id is required'),
  param('pId').trim().notEmpty().withMessage('Property Id is required'),

  body('description').trim().notEmpty().withMessage('Description is required'),
  body('type').trim().notEmpty().withMessage('Type is required'),
  body('price').trim().notEmpty().withMessage('Price is required'),

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

export const validateUpdateRoom = [
  param('id').trim().notEmpty().withMessage('Id is required'),
  param('pId').trim().notEmpty().withMessage('Property Id is required'),
  param('rId').trim().notEmpty().withMessage('Room Id is required'),

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

export const validateDeleteRoom = [
  param('id').trim().notEmpty().withMessage('Id is required'),
  param('pId').trim().notEmpty().withMessage('Room Id is required'),
  param('rId').trim().notEmpty().withMessage('Room Id is required'),

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
