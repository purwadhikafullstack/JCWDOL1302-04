import { RoomAvailabilityController } from "../controllers/roomAvailability.controller";
import { tenantGuard, verifyToken } from "../middlewares/auth.middleware";
import { validatePatchRoomAvailability, validatePostRoomAvailability } from "../validation/roomAvailability.validatioin";
import { Router } from "express";

export class RoomAvailabilityRouter {
  private router: Router;
  private roomAvailabilityController: RoomAvailabilityController;

  constructor() {
    this.roomAvailabilityController = new RoomAvailabilityController();
    this.router = Router()
    this.initializeRouters();
  }

  private initializeRouters(): void {
    this.router.use(verifyToken, tenantGuard);
    this.router.get(
      '/:userId',
      this.roomAvailabilityController.getRoomAvailabilitiresByUserId
    );
    this.router.post(
      "/",
      validatePostRoomAvailability,
      this.roomAvailabilityController.postRoomAvailability
    );
    this.router.patch(
      "/:id",
      validatePatchRoomAvailability,
      this.roomAvailabilityController.patchRoomAvailabilityById
    );
    this.router.delete(
      "/:id",
      this.roomAvailabilityController.deleteRoomAvailabilityById
    );
  }

  getRouter(): Router {
    return this.router;
  }
}