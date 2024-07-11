import { RoomController } from '../controllers/room.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { uploaderSingle } from '../middlewares/upload-single';
import {
  validatAddRoom,
  validateDeleteRoom,
  validateUpdateRoom,
  validatGetRooms,
  validatGetRoomDetail,
} from '../validation/room.validation';

import { Router } from 'express';

export class RoomRouter {
  private router: Router;
  private roomController: RoomController;

  constructor() {
    this.roomController = new RoomController();

    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use(verifyToken);

    this.router.get(
      '/all/:id/:pId',
      validatGetRooms,
      this.roomController.getRooms,
    );
    this.router.get(
      '/detail/:id/:pId/:rId',
      validatGetRoomDetail,
      this.roomController.getDetailRoom,
    );
    this.router.post(
      '/create/:id/:pId',
      uploaderSingle('IMG', '/rooms').single('image'),
      validatAddRoom,
      this.roomController.addRoom,
    );
    this.router.patch(
      '/update/:id/:pId/:rId',
      uploaderSingle('IMG', '/rooms').single('image'),
      validateUpdateRoom,
      this.roomController.updateRoom,
    );
    this.router.delete(
      '/delete/:id/:pId/:rId',
      validateDeleteRoom,
      this.roomController.deleteRoom,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
