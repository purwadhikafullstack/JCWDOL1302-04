import { RoomService } from "../services/room.service";
import { SpecialPriceService } from "../services/specialPrice.service";
import { NextFunction, Request, Response } from "express";
import { AddSpecialPriceReq, UpdateSpecialPriceReq } from "../../models/specialPrice.modal";

export class SpecialPriceController {
  async getSpecialPricesByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      const specialPrices = await SpecialPriceService.getSpecialPricesByUserId(userId);

      res.status(200).send({
        status: 'success',
        data: specialPrices
      })
    } catch (e) {
      next(e)
    }
  }

  async postSpecialPrice(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as AddSpecialPriceReq;

      await RoomService.verifyRoomById(request.roomId);
      const specialPrice = await SpecialPriceService.addSpecialPrice(request);

      res.status(201).send({
        status: 'success',
        data: specialPrice
      })
    } catch (e) {
      next(e)
    }
  }
  
  async patchSpecialPriceById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const request = req.body as UpdateSpecialPriceReq;

      await SpecialPriceService.verifySpecialPriceById(id);
      const specialPrice = await SpecialPriceService.updateSpecialPriceById({req: request, id});

      res.status(201).send({
        status: 'success',
        data: specialPrice
      })
    } catch (e) {
      next(e)
    }
  }

  async deleteSpecialPriceById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await SpecialPriceService.verifySpecialPriceById(id);
      const specialPrice = await SpecialPriceService.deleteSpecialPriceById(id);

      res.status(200).send({
        status: 'success',
        data: specialPrice
      })
    } catch (e) {
      next(e)
    }
  }
}