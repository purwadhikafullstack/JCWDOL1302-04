import { ResponseError } from '../error/response-error';
import { PropertyService } from '../services/property.service';
import { UserService } from '../services/user.service';
import { NextFunction, Request, Response } from 'express';
import {
  AddUPropertyReq,
  GetDetailPropertyReq,
  GetPropertiesQuery,
  GetPropertiesReq,
  UpdatePropertyPar,
  UpdatePropertyReq,
} from 'models/property.model';

export class PropertyController {
  async getPropertiesForClient(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const reqQuery = req.query as GetPropertiesQuery;

      const { properties, totalPage, totalResult } =
        await PropertyService.getPropertiesForClient(reqQuery);

      res.status(200).send({
        status: 'success',
        data: {
          properties,
          totalPage,
          totalResult,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  async getPropertyDetailForClient(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { pId: id } = req.params;

      const property = await PropertyService.getPropertyForClient({ id });

      res.status(200).send({
        status: 'success',
        data: property,
      });
    } catch (e) {
      next(e);
    }
  }

  async getProperty(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.params as GetPropertiesReq;

      await UserService.verifyUserById({ id: request.id });

      const property = await PropertyService.getProperty({ ...request });

      res.status(200).send({
        status: 'success',
        data: property,
      });
    } catch (e) {
      next(e);
    }
  }

  async getDetailProperty(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.params as GetDetailPropertyReq;

      await UserService.verifyUserById({ id: request.id });

      const property = await PropertyService.getDetailProperty({ ...request });

      res.status(200).send({
        status: 'success',
        data: property,
      });
    } catch (e) {
      next(e);
    }
  }

  async addProperty(req: Request, res: Response, next: NextFunction) {
    try {
      const { file } = req;

      if (file == undefined) {
        throw new ResponseError(404, 'Image is required');
      }

      const request = req.body as AddUPropertyReq;
      request.image = file.filename;
      request.propertyCategoryId = Number(request.propertyCategoryId);

      await UserService.verifyUserByEmail({ email: request.email });

      const property = await PropertyService.addProperty({ ...request });

      res.status(200).send({
        status: 'success',
        data: property,
      });
    } catch (e) {
      next(e);
    }
  }

  async updateProperty(req: Request, res: Response, next: NextFunction) {
    try {
      const { file } = req;

      const request = req.body as UpdatePropertyReq;
      const params = req.params as UpdatePropertyPar;

      request.image = file?.filename;

      request.propertyCategoryId = Number(request.propertyCategoryId);

      await UserService.verifyUserById({ id: params.id });

      const property = await PropertyService.updateProperty({
        ...request,
        ...params,
      });

      res.status(200).send({
        status: 'success',
        data: property,
      });
    } catch (e) {
      next(e);
    }
  }

  async deleteProperty(req: Request, res: Response, next: NextFunction) {
    try {
      const params = req.params as UpdatePropertyPar;

      await UserService.verifyUserById({ id: params.id });

      const property = await PropertyService.deleteProperty({
        ...params,
      });

      res.status(200).send({
        status: 'success',
        data: property,
      });
    } catch (e) {
      next(e);
    }
  }

  async getPropertyRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      const propertyRooms = await PropertyService.getPropertyRooms(userId);

      res.status(200).send({
        status: 'success',
        data: propertyRooms,
      });
    } catch (e) {
      next(e);
    }
  }

  async getThreeTopProperty(req: Request, res: Response, next: NextFunction) {
    try {
      const propertyRooms = await PropertyService.getThreeTopProperty();

      res.status(200).send({
        status: 'success',
        data: propertyRooms,
      });
    } catch (e) {
      next(e);
    }
  }
}
