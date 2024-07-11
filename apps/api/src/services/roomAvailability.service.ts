import { ResponseError } from "../error/response-error";
import prisma from "../prisma";
import {
  AddRoomAvailabilityReq,
  GetRoomAvailabilityRes,
  UpdateRoomAvailabilityReq
} from "../../models/roomAvailability.model";

export class RoomAvailabilityService {
  static async getRoomAvailabilitiesByUserId(userId: string) {
    const roomAvaila = await prisma.$queryRaw`SELECT p.name, r.type, r.id as roomId, ra.id AS roomAvailaId, ra.fromDate, ra.toDate
      FROM properties p
      INNER JOIN rooms r ON p.id=r.property_id
      INNER JOIN roomAvailabilities ra ON r.id=ra.room_id
      WHERE p.user_id = ${userId}
      ORDER BY p.name ASC`;

    return roomAvaila as GetRoomAvailabilityRes;
  }

  static async addRoomAvailability(req: AddRoomAvailabilityReq) {
    const roomAvailability = await prisma.roomAvailability.create({
      data: req
    });

    return roomAvailability;
  }

  static async updateRoomAvailabilityById({req, id}:{req: UpdateRoomAvailabilityReq, id: string}) {
    const roomAvailability = await prisma.roomAvailability.update({
      data: req,
      where: { id }
    });

    return roomAvailability;
  }

  static async deleteRoomAvailabilityById(id: string) {
    const roomAvailability = await prisma.roomAvailability.delete({
      where: { id }
    });

    return roomAvailability;
  }

  static async verifyRoomAvailabilityById(id: string) {
    const roomAvailability = await prisma.roomAvailability.findUnique({
      where: { id }
    });

    if (!roomAvailability) throw new ResponseError(404, 'Room availability not found');
  }
}