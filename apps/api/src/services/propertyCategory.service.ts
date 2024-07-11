import { ResponseError } from "../error/response-error";
import prisma from "../prisma";

export class PropertyCategoryService {
  static async getPropertyCategory() {
    const propertyCategory = await prisma.propertyCategory.findMany();

    return propertyCategory;
  }
  static async addPropertyCategory(req: { name: string }) {
    const propertyCategory = await prisma.propertyCategory.create({
      data: { name: req.name }
    });

    return propertyCategory;
  }

  static async updatePropertyCategory(req: { id: number, name: string }) {
    const propertyCategory = await prisma.propertyCategory.update({
      where: { id: req.id },
      data: { name: req.name }
    });

    return propertyCategory;
  }

  static async deletePropertyCategory(req: { id: number }) {
    const propertyCategory = await prisma.propertyCategory.delete({
      where: { id: req.id }
    });

    return propertyCategory;
  }

  static async verifyPropertyCategory(req: { id: number }) {
    const propertyCategory = await prisma.propertyCategory.findUnique({
      where: { id: req.id }
    });

    if (!propertyCategory) {
      throw new ResponseError(404, "Property category id not found");
    }
  }
}
