import { ResponseError } from '../error/response-error';
import prisma from '../prisma';
import { Prisma } from '@prisma/client';
import {
  AddUPropertyReq,
  GetDetailPropertyReq,
  GetPropertiesQuery,
  GetPropertiesReq,
  toAddPropertyRes,
  toDeletePropertyRes,
  toGetDetailPropertyClientRes,
  toGetDetailPropertyRes,
  toGetPropertiesRes,
  toGetPropertyRoomsRes,
  toGetThreeTopPropertyClientRes,
  UpdatePropertyPar,
  UpdatePropertyReq,
} from '../../models/property.model';
import { ReviewService } from './review.service';

interface UpdatePropertyServiceProps
  extends UpdatePropertyReq,
    UpdatePropertyPar {}

export class PropertyService {
  static async getPropertiesForClient(reqQuery: GetPropertiesQuery) {
    let where = Prisma.sql``;
    let orderBy = Prisma.sql`ORDER BY p.name ASC`;
    const limit = 8;
    const offset = reqQuery.page ? Number(reqQuery.page) * limit : 0;

    if (reqQuery.fromDate && reqQuery.toDate && reqQuery.name) {
      where = Prisma.sql`WHERE ${reqQuery.fromDate} >= ra.fromDate AND ${reqQuery.toDate} <= ra.toDate
          AND p.name LIKE CONCAT('%', ${reqQuery.name}, '%')`;
    }

    if (reqQuery.fromDate && reqQuery.toDate && !reqQuery.name) {
      where = Prisma.sql`WHERE  ${reqQuery.fromDate} >= ra.fromDate AND ${reqQuery.toDate} <= ra.toDate`;
    }

    if (reqQuery.fromDate && !reqQuery.toDate && !reqQuery.name) {
      where = Prisma.sql`WHERE ${reqQuery.fromDate} >= ra.fromDate AND ${reqQuery.fromDate} <= ra.toDate`;
    }

    if (reqQuery.fromDate && !reqQuery.toDate && reqQuery.name) {
      where = Prisma.sql`WHERE ${reqQuery.fromDate} >= ra.fromDate AND ${reqQuery.fromDate} <= ra.toDate
        AND p.name LIKE CONCAT('%', ${reqQuery.name}, '%')`;
    }

    if (!reqQuery.fromDate && !reqQuery.toDate && reqQuery.name) {
      where = Prisma.sql`WHERE p.name LIKE CONCAT('%', ${reqQuery.name}, '%')`;
    }

    if (reqQuery.sortPrice === 'termurah') {
      orderBy = Prisma.sql`ORDER BY minPrice ASC`;
    }

    if (reqQuery.sortPrice === 'termahal') {
      orderBy = Prisma.sql`ORDER BY minPrice DESC`;
    }

    const properties =
      await prisma.$queryRaw`SELECT p.id, p.name, p.description,
        p.location, p.image, MIN(rp.price) AS minPrice, MAX(rp.price) AS maxPrice,
        AVG(rv.point) as rating
        FROM properties p
        INNER JOIN rooms r ON p.id=r.property_id
        INNER JOIN roomPrices rp ON r.id=rp.room_id
        INNER JOIN roomAvailabilities ra ON r.id=ra.room_id
        LEFT JOIN orderRooms odr ON r.id=odr.room_id
        LEFT JOIN orders o ON odr.order_id=o.id
        LEFT JOIN reviews rv ON o.id=rv.order_id
        ${where}
        GROUP BY p.id
        ${orderBy}
        LIMIT ${limit} OFFSET ${offset}`;

    const countProperties =
      (await prisma.$queryRaw`SELECT p.id, p.name, p.description,
        p.location, p.image, MIN(rp.price) AS minPrice, MAX(rp.price) AS maxPrice
        FROM properties p
        INNER JOIN rooms r ON p.id=r.property_id
        INNER JOIN roomPrices rp ON r.id=rp.room_id
        INNER JOIN roomAvailabilities ra ON r.id=ra.room_id
        ${where}
        GROUP BY p.id`) as any;

    const totalPage = Math.ceil(countProperties.length / limit);

    return {
      properties,
      totalPage,
      totalResult: countProperties.length,
    };
  }

  static async getPropertyForClient(req: GetPropertiesReq) {
    const { id } = req;

    const property = await prisma.property.findUnique({
      where: {
        id,
      },
      include: {
        rooms: {
          include: {
            roomPrices: true,
            specialPrices: true,
            roomAvailabilities: true,
          },
        },
        propertyCategory: true,
      },
    });

    if (!property) throw new ResponseError(404, 'Property does not exist.');

    const {
      id: pId,
      name,
      description,
      propertyCategory,
      location,
      image,
      rooms,
    } = property;

    const result = {
      id: pId,
      name,
      description,
      category: propertyCategory.name,
      location,
      image,
      rooms,
    };

    return toGetDetailPropertyClientRes(result);
  }

  static async getProperty(req: GetPropertiesReq) {
    const { id } = req;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new ResponseError(404, 'User does not exist.');

    const property = await prisma.property.findMany({
      where: {
        userId: user.id,
      },
    });

    return toGetPropertiesRes(property);
  }

  static async getDetailProperty(req: GetDetailPropertyReq) {
    const { id, pId } = req;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new ResponseError(404, 'User does not exist.');

    const property = await prisma.property.findUnique({
      where: {
        id: pId,
        userId: user.id,
      },
    });

    if (!property) throw new ResponseError(404, 'Property does not exist.');

    return toGetDetailPropertyRes(property);
  }

  static async addProperty(req: AddUPropertyReq) {
    const user = await prisma.user.findUnique({
      where: {
        email: req.email,
      },
    });

    if (!user) throw new ResponseError(404, 'User does not exist.');

    const { name, description, location, propertyCategoryId, image } = req;

    const property = await prisma.property.create({
      data: {
        userId: user.id,
        name,
        description,
        location,
        propertyCategoryId,
        image,
      },
    });

    return toAddPropertyRes({ ...property });
  }

  static async updateProperty(req: UpdatePropertyServiceProps) {
    const { id, pId, name, description, location, propertyCategoryId, image } =
      req;

    const property = await prisma.property.update({
      where: {
        id: pId,
        userId: id,
      },
      data: {
        name,
        description,
        location,
        propertyCategoryId,
        image,
      },
    });

    return toAddPropertyRes({ ...property });
  }

  static async deleteProperty(req: UpdatePropertyPar) {
    const { id, pId } = req;

    const propertyR = await prisma.property.findUnique({
      where: {
        id: pId,
        userId: id,
      },
    });

    if (!propertyR) {
      throw new Error('Property not found or does not belong to the user.');
    }

    // Find all rooms related to the property
    const roomsR = await prisma.room.findMany({
      where: {
        propertyId: pId,
      },
    });

    // Delete all RoomPrice, RoomAvailability, and records related to the rooms
    for (const room of roomsR) {
      await prisma.roomPrice.deleteMany({
        where: {
          roomId: room.id,
        },
      });

      await prisma.roomAvailability.deleteMany({
        where: {
          roomId: room.id,
        },
      });

      await prisma.specialPrice.deleteMany({
        where: {
          roomId: room.id,
        },
      });

      await prisma.orderRoom.deleteMany({
        where: {
          roomId: room.id,
        },
      });
    }

    // Delete all Room records related to the property
    await prisma.room.deleteMany({
      where: {
        propertyId: pId,
      },
    });

    // Finally, delete the Property
    const propertyD = await prisma.property.delete({
      where: {
        id: pId,
        userId: id,
      },
    });

    return toDeletePropertyRes(propertyD.id);
  }

  static async getThreeTopProperty() {
    // Fetch all properties with their rooms and orderRooms
    const propertiesWithOrderRooms = await prisma.property.findMany({
      include: {
        rooms: {
          include: {
            orderRooms: true,
          },
        },
      },
    });

    // Sort properties based on the quantity of orderRooms
    const sortedProperties = propertiesWithOrderRooms
      .map((property) => {
        const orderRoomsCount = property.rooms.reduce(
          (count, room) => count + room.orderRooms.length,
          0,
        );
        return { ...property, orderRoomsCount };
      })
      .sort((a, b) => b.orderRoomsCount - a.orderRoomsCount);

    // Ensure at least 3 properties are included
    const topProperties = sortedProperties.slice(0, 3);
    const uniquePropertyRooms = [];
    const propertyIds: string[] = [];

    for (const property of topProperties) {
      const propertyId = property.id;
      if (!propertyIds.includes(propertyId)) {
        const propertyReviews =
          await ReviewService.getReviewsByPropertyId(propertyId);

        const points = propertyReviews.map((pr) => pr.point);
        const rating =
          points.length > 0
            ? points.reduce((t, c) => t + c) / points.length
            : 0;

        uniquePropertyRooms.push({
          ...property,
          review: points.length,
          rating,
        });

        propertyIds.push(propertyId);
      }
    }

    // If there are less than 3 unique properties, fill with properties without orderRooms
    if (uniquePropertyRooms.length < 3) {
      const propertiesWithoutOrderRooms = await prisma.property.findMany({
        where: {
          rooms: {
            none: {
              orderRooms: {
                some: {},
              },
            },
          },
        },
        take: 3 - uniquePropertyRooms.length,
      });

      for (const property of propertiesWithoutOrderRooms) {
        const propertyId = property.id;
        const propertyReviews =
          await ReviewService.getReviewsByPropertyId(propertyId);

        const points = propertyReviews.map((pr) => pr.point);
        const rating =
          points.length > 0
            ? points.reduce((t, c) => t + c) / points.length
            : 0;

        uniquePropertyRooms.push({
          ...property,
          review: points.length,
          rating,
        });

        if (uniquePropertyRooms.length >= 3) {
          break;
        }
      }
    }

    return toGetThreeTopPropertyClientRes(
      uniquePropertyRooms.map(
        ({ id, name, location, image, rating, review }) => ({
          id,
          name,
          location,
          image,
          rating,
          review,
        }),
      ),
    );
  }

  static async getPropertyRooms(userId: string) {
    const propertyRooms = await prisma.property.findMany({
      include: {
        rooms: {
          include: {
            roomAvailabilities: true,
          },
        },
      },
      where: { userId },
      orderBy: { name: 'asc' },
    });

    if (propertyRooms.length === 0)
      throw new ResponseError(404, 'You have not added any property yet.');

    return toGetPropertyRoomsRes(propertyRooms);
  }

  static async verifyPropertyById(id: string) {
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) throw new ResponseError(404, 'Property not found.');
  }
}
