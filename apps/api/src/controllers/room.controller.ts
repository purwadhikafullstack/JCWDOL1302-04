import { ResponseError } from '../error/response-error';
import { RoomService } from '../services/room.service';
import { UserService } from '../services/user.service';
import { NextFunction, Request, Response } from 'express';
import {
  AddRoomPar,
  AddRoomReq,
  DeleteRoomPar,
  GetDetailRoomReq,
  GetRoomsPar,
  UpdateRoomPar,
  UpdateRoomReq,
} from '../../models/room.model';

export class RoomController {
  async getRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.params as GetRoomsPar;

      await UserService.verifyUserById({ id: request.id });

      const room = await RoomService.getRooms({ ...request });

      res.status(200).send({
        status: 'success',
        data: room,
      });
    } catch (e) {
      next(e);
    }
  }

  async getDetailRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.params as GetDetailRoomReq;

      await UserService.verifyUserById({ id: request.id });

      const room = await RoomService.getDetailRoom({ ...request });

      res.status(200).send({
        status: 'success',
        data: room,
      });
    } catch (e) {
      next(e);
    }
  }

  async addRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { file } = req;

      if (file == undefined) {
        throw new ResponseError(404, 'Image is required');
      }

      const params = req.params as AddRoomPar;
      const request = req.body as AddRoomReq;

      request.image = file.filename;

      await UserService.verifyUserById({ id: params.id });

      const room = await RoomService.addRoom({ ...params, ...request });

      res.status(200).send({
        status: 'success',
        data: room,
      });
    } catch (e) {
      next(e);
    }
  }

  async updateRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { file } = req;

      const request = req.body as UpdateRoomReq;
      const params = req.params as UpdateRoomPar;

      request.image = file?.filename;

      await UserService.verifyUserById({ id: params.id });

      const room = await RoomService.updateRoom({
        ...request,
        ...params,
      });

      res.status(200).send({
        status: 'success',
        data: room,
      });
    } catch (e) {
      next(e);
    }
  }

  async deleteRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const params = req.params as DeleteRoomPar;

      await UserService.verifyUserById({ id: params.id });

      const room = await RoomService.deleteRoom({
        ...params,
      });

      res.status(200).send({
        status: 'success',
        data: room,
      });
    } catch (e) {
      next(e);
    }
  }
}
