import { ResponseError } from '../error/response-error';
import prisma from '../prisma';
import {
  AddRoomPar,
  AddRoomReq,
  DeleteRoomPar,
  GetDetailRoomReq,
  GetRoomsPar,
  toAddRoomRes,
  toDeleteRoomRes,
  toGetDetailRoomRes,
  toGetRoomsRes,
  UpdateRoomPar,
  UpdateRoomReq,
} from '../../models/room.model';

interface UpdateRoomServiceProps extends UpdateRoomReq, UpdateRoomPar {}

interface AddRoomServiceProps extends AddRoomReq, AddRoomPar {}

export class RoomService {
  static async getRooms(req: GetRoomsPar) {
    const { id, pId } = req;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new ResponseError(404, 'User is not exist.');

    const room = await prisma.room.findMany({
      where: {
        propertyId: pId,
      },
      include: {
        roomPrices: true,
      },
    });

    const result = room.map((item) => {
      return {
        ...item,
        price: item.roomPrices!.price,
      };
    });

    return toGetRoomsRes([...result]);
  }

  static async getDetailRoom(req: GetDetailRoomReq) {
    const { id, pId, rId } = req;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new ResponseError(404, 'User is not exist.');

    const room = await prisma.room.findUnique({
      where: {
        id: rId,
        propertyId: pId,
      },
      include: {
        roomPrices: true,
      },
    });

    if (!room) throw new ResponseError(404, 'Room is not exist.');
    if (!room.roomPrices)
      throw new ResponseError(404, 'Room Price is not exist.');

    return toGetDetailRoomRes({ ...room, price: room.roomPrices.price });
  }

  static async addRoom(req: AddRoomServiceProps) {
    const { id, pId, description, type, image, price } = req;

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) throw new ResponseError(404, 'User is not exist.');

    const room = await prisma.room.create({
      data: {
        type,
        description,
        propertyId: pId,
        image,
        roomPrices: {
          create: {
            price: Number(price),
          },
        },
      },
      include: {
        roomPrices: true,
      },
    });

    return toAddRoomRes({ ...room, price: room.roomPrices!.price });
  }

  static async updateRoom(req: UpdateRoomServiceProps) {
    const { id, pId, rId, type, description, image, price } = req;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new ResponseError(404, 'User is not exist.');

    const room = await prisma.room.update({
      where: {
        id: rId,
        propertyId: pId,
      },
      data: {
        type,
        description,
        propertyId: pId,
        image,
        roomPrices: {
          update: {
            price: Number(price),
          },
        },
      },

      include: {
        roomPrices: true,
      },
    });

    return toAddRoomRes({ ...room, price: room.roomPrices!.price });
  }

  static async deleteRoom(req: DeleteRoomPar) {
    const { id, pId, rId } = req;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new ResponseError(404, 'User is not exist.');

    await prisma.roomPrice.delete({
      where: {
        roomId: rId,
      },
    });

    await prisma.specialPrice.deleteMany({
      where: {
        roomId: rId,
      },
    });

    await prisma.roomAvailability.deleteMany({
      where: {
        roomId: rId,
      },
    });

    await prisma.orderRoom.deleteMany({
      where: {
        roomId: rId,
      },
    });

    const room = await prisma.room.delete({
      where: {
        id: rId,
        propertyId: pId,
      },
    });

    return toDeleteRoomRes(room.id);
  }

  static async verifyRoomById(id: string) {
    const room = await prisma.room.findUnique({
      where: { id },
    });

    if (!room) throw new ResponseError(404, 'Room not found');
  }
}
