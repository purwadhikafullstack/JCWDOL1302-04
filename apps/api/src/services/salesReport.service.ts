import prisma from "../prisma";
import { TSalesReportPropertyByUserId } from "../../models/salesReport.model";

export class SalesReportService {
  static async getSalesReportPropertiesByUserId(id: string) {
    const salesReport = await prisma.$queryRaw`SELECT p.name, p.location,
      r.type, MAX(odr.quantity) as maxQuantity, SUM(odr.quantity) as totalQuantity,
      SUM(o.totalPayment) as totalPenghasilan
      FROM properties p
      INNER JOIN rooms r ON p.id=r.property_id
      INNER JOIN orderRooms odr ON r.id=odr.room_id
      INNER JOIN orders o ON odr.order_id=o.id
      LEFT JOIN reviews rv ON o.id=rv.order_id
      WHERE p.user_id=${id} AND o.status='finished'
      GROUP BY r.id` as TSalesReportPropertyByUserId[];

    return salesReport;
  }
}