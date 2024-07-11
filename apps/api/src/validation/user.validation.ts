import { NextFunction, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';

export const validatePostUser = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().notEmpty().withMessage('Email is required'),
  body('provider')
    .if((value) => value)
    .custom((value) => {
      if (!(value === 'google')) {
        throw new Error('Provider is not valid');
      }
      return value;
    })
    .trim(),
  body('password')
    .if(body('provider').isEmpty())
    .notEmpty()
    .trim()
    .isLength({ min: 6 })
    .withMessage('Min length password is 6 character')
    .custom((value, { req }) => {
      if (!!req.body.provider && value) {
        throw new Error("Can't using password when using provider");
      }
      return value;
    }),
  body('image')
    .if(body('provider').notEmpty())
    .notEmpty()
    .withMessage('Image is required')
    .custom((value, { req }) => {
      if (!!!req.body.provider && value) {
        throw new Error("Image can't use when not use provider");
      }
      return value;
    }),
  body('role').trim().notEmpty().withMessage('Role is required'),

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

export const validatePutAccountUser = [
  param('id').trim().notEmpty().withMessage('Id is required'),

  body('name').trim().notEmpty().withMessage('Name is required'),
  body('gender').trim().notEmpty().withMessage('Gender is required'),
  body('birthdate').trim().notEmpty().withMessage('Birthdate is required'),
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

export const validateGetUser = [
  body('email').trim().isEmail().notEmpty().withMessage('Email is required'),
  body('password')
    .if((value) => value)
    .trim()
    .isLength({ min: 1 })
    .withMessage('Password is required'),

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

export const validateVerificationUser = [
  body('token').trim().notEmpty().withMessage('Email is required'),

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

export const validateGetAccountUser = [
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

export const validateUpdateUserNotVerifiedAndPasswordByEmail = [
  body('email').trim().isEmail().notEmpty().withMessage('Email is required'),
  body('password')
    .trim()
    .notEmpty()
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password is required'),

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

export const validateUpdateImage = [
  body('email').trim().isEmail().notEmpty().withMessage('Email is required'),

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

export const validateCheckEmail = [
  body('email').trim().isEmail().notEmpty().withMessage('Email is required'),

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
