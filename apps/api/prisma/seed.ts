import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import { dataPropertyCatergories } from "./data-seed/propertyCategories";

const prisma = new PrismaClient();

const seedSuperAdmin = async () => {
  console.log("--- Start seeding user super admin ---");

  const existingSuperAdmin = await prisma.user.findUnique({
    where: {
      email: "superadmin@gmail.com"
    }
  });

  if (existingSuperAdmin) {
    await prisma.user.delete({
      where: {
        email: "superadmin@gmail.com"
      }
    });
  }

  await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "superadmin@gmail.com",
      password: await bcrypt.hash("superadmin123", 10),
      role: "SUPER_ADMIN",
      isVerified: true
    }
  });

  console.log("--- Seeding user super admin success ---");
};

const seedPropertyCategories = async () => {
  console.log("--- Start seeding property categories ---");

  await prisma.propertyCategory.deleteMany();
  await prisma.$queryRaw`ALTER TABLE propertyCategories AUTO_INCREMENT = 1`

  dataPropertyCatergories.map(async (data) => {
    await prisma.propertyCategory.create({
      data: {
        name: data.name
      }
    });
  });

  console.log("--- Seeding property categories success ---");
}

const main = async () => {
  await seedSuperAdmin();
  await seedPropertyCategories();
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
