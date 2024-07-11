import { NextFunction, Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';

export const validatGetProperties = [
  param('id').trim().notEmpty().withMessage('Id is required'),

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

export const validatGetPropertyDetail = [
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

export const validatAddProperty = [
  body('email').trim().isEmail().notEmpty().withMessage('Email is required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('propertyCategoryId')
    .trim()
    .notEmpty()
    .withMessage('PropertyCategoryId is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),

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

export const validateUpdateProperty = [
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

export const validateDeleteProperty = [
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
