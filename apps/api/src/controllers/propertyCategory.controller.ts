import { PropertyCategoryService } from "../services/propertyCategory.service";
import { NextFunction, Request, Response } from "express";

export class PropertyCategoryController {
  async getPropertyCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const propertyCategory = await PropertyCategoryService.getPropertyCategory();
      
      res.status(200).send({
        data: propertyCategory
      });
    } catch (e) {
      next(e)
    }
  }
  async postPropertyCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const requset = req.body as { name: string };

      const propertyCategory = await PropertyCategoryService.addPropertyCategory(requset);

      res.status(201).send({
        status: "success",
        data: propertyCategory
      });
    } catch (e) {
      next(e)
    }
  }

  async patchPropertyCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as { id: number, name: string };
      request.id = +req.params.id

      await PropertyCategoryService.verifyPropertyCategory({ id: request.id });
      const propertyCategory = await PropertyCategoryService.updatePropertyCategory(request);

      res.status(200).send({
        status: "success",
        data: propertyCategory
      })
    } catch (e) {
      next(e)
    }
  }

  async deletePropertyCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id }  = req.params;

      await PropertyCategoryService.verifyPropertyCategory({ id: +id });
      const propertyCategory = await PropertyCategoryService.deletePropertyCategory({ id: +id });
      
      res.status(200).send({
        status: "success",
        data: propertyCategory
      })
    } catch (e) {
      next(e)
    }
  }
}