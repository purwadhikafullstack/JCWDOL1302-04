import prisma from "../prisma";
import { Prisma } from "@prisma/client";
import { AddReviewReq, TGetOrderRooms, TGetReviewsByPropertyId, toGetReviewsByPropertyIdRes } from "../../models/review.model";

export class ReviewService {
  static async addReview(req: AddReviewReq) {
    req.point = +req.point;

    const review = await prisma.review.create({
      data: req
    })

    return review;
  }

  static async getReviewsByPropertyId(propertyId: string) {
    const reviews = await prisma.$queryRaw`SELECT rv.*, u.name, u.image
      FROM reviews rv
      INNER JOIN orders o ON rv.order_id=o.id
      INNER JOIN users u ON o.user_id=u.id
      INNER JOIN orderRooms ors ON o.id=ors.order_id
      INNER JOIN rooms r ON ors.room_id=r.id
      INNER JOIN properties p ON r.property_id=p.id
      WHERE p.id=${propertyId}` as TGetReviewsByPropertyId[];

    const ordersId = reviews.map((o) => o.order_id);

    let orderRooms = [] as TGetOrderRooms[];

    if (ordersId.length > 0) {
      orderRooms = await prisma.$queryRaw`SELECT ors.order_id as orderId, r.type
        FROM orderRooms ors
        INNER JOIN rooms r ON ors.room_id=r.id
        WHERE ors.order_id IN (${Prisma.join(ordersId)})` as TGetOrderRooms[]
    }


    return toGetReviewsByPropertyIdRes({ reviews, orderRooms });
  }
}
