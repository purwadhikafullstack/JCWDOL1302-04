import { PropertyController } from '../controllers/property.controller';
import { PropertyCategoryController } from '../controllers/propertyCategory.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { uploaderSingle } from '../middlewares/upload-single';
import {
  validatAddProperty,
  validateDeleteProperty,
  validateUpdateProperty,
  validatGetProperties,
  validatGetPropertyDetail,
} from '../validation/property.valiadtion';

import { Router } from 'express';

export class PropertyRouter {
  private router: Router;
  private propertyController: PropertyController;
  private propertyCategoryController: PropertyCategoryController;

  constructor() {
    this.propertyController = new PropertyController();
    this.propertyCategoryController = new PropertyCategoryController();

    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/client/top-property', this.propertyController.getThreeTopProperty);
    this.router.get('/client', this.propertyController.getPropertiesForClient);
    this.router.get('/client/:pId', this.propertyController.getPropertyDetailForClient);

    this.router.use(verifyToken);

    this.router.get('/rooms/:userId', this.propertyController.getPropertyRooms);
    this.router.get(
      '/all/:id',
      validatGetProperties,
      this.propertyController.getProperty,
    );
    this.router.get(
      '/:id/:pId',
      validatGetPropertyDetail,
      this.propertyController.getDetailProperty,
    );
    this.router.get(
      '/categories',
      this.propertyCategoryController.getPropertyCategory,
    );
    this.router.post(
      '/',
      uploaderSingle('IMG', '/properties').single('image'),
      validatAddProperty,
      this.propertyController.addProperty,
    );
    this.router.patch(
      '/:id/:pId',
      uploaderSingle('IMG', '/properties').single('image'),
      validateUpdateProperty,
      this.propertyController.updateProperty,
    );
    this.router.delete(
      '/delete/:id/:pId',
      validateDeleteProperty,
      this.propertyController.deleteProperty,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
