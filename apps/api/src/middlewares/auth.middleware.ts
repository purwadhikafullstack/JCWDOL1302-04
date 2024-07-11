import { ResponseError } from "../error/response-error";
import { User } from "../types/express";
import { NextFunction, Request, Response } from "express";
import TokenManager from "../../lib/tokenManager";

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) throw new ResponseError(400, 'Token invalid');

    const verifyUser = TokenManager.verifyToken(token);

    if (!verifyUser) throw new ResponseError(403, 'Unauthorized');

    req.user = verifyUser as User;

    next();
  } catch (e) {
    next(e);
  }
};

export const superAdminGuard = async (req: Request, res: Response, next: NextFunction,) => {
  try {
    if (String(req.user?.role).toUpperCase() !== 'SUPER_ADMIN')
      throw new ResponseError(403, 'Unauthorized');

    next();
  } catch (e) {
    next(e);
  }
};

export const tenantGuard = async (req: Request, res: Response, next: NextFunction,) => {
  try {
    if (String(req.user?.role).toUpperCase() !== 'TENANT' &&String(req.user?.role).toUpperCase() !== 'SUPER_ADMIN')
      throw new ResponseError(403, 'Unauthorized');

    next();
  } catch (e) {
    next(e);
  }
};
