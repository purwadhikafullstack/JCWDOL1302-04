import { SalesReportService } from "../services/salesReport.service";
import { NextFunction, Request, Response } from "express";

export class SalesReportController {
  async getSalesReportPropertiesByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      const salesRepot = await SalesReportService.getSalesReportPropertiesByUserId(userId);

      res.status(200).send({
        data: salesRepot
      })
    } catch (e) {
      next(e)
    }
  }
}