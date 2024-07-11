import { ResponseError } from "../error/response-error";
import prisma from "../prisma";
import {
  AddSpecialPriceReq,
  GetSpecialPriceRes,
  UpdateSpecialPriceReq
} from "../../models/specialPrice.modal";

export class SpecialPriceService {
  static async getSpecialPricesByUserId(userId: string) {
    const specialPrices = await prisma.$queryRaw`SELECT p.name, r.type, r.id as roomId, 
      sp.id AS specialPriceId, sp.price, sp.fromDate, sp.toDate
      FROM properties p
      INNER JOIN rooms r ON p.id=r.property_id
      INNER JOIN specialPrices sp ON r.id=sp.room_id
      WHERE p.user_id = ${userId}
      ORDER BY p.name ASC`;

    return specialPrices as GetSpecialPriceRes;
  }

  static async addSpecialPrice(req: AddSpecialPriceReq) {
    req.price = +req.price;
    if (!req.toDate) req.toDate = null;

    const specialPrice = await prisma.specialPrice.create({
      data: req
    });

    return specialPrice;
  }

  static async updateSpecialPriceById({req, id}:{req: UpdateSpecialPriceReq, id: string}) {
    req.price = +req.price;
    if (!req.toDate) req.toDate = null;

    const specialPrice = await prisma.specialPrice.update({
      data: req,
      where: { id }
    });

    return specialPrice;
  }

  static async deleteSpecialPriceById(id: string) {
    const specialPrice = await prisma.specialPrice.delete({
      where: { id }
    });

    return specialPrice;
  }

  static async verifySpecialPriceById(id: string) {
    const specialPrice = await prisma.specialPrice.findUnique({
      where: { id }
    });

    if (!specialPrice) throw new ResponseError(404, 'Special price not found');
  }
}