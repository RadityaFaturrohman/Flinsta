import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await hash("adminPassword123", 12);
  const user = await prisma.user.upsert({
    where: {
      email: "admin@flinsta.com",
    },
    update: {},
    create: {
      email: 'admin@flinsta.com',
      name: "Flinsta",
      role: Role.admin,
      password,
      username: "fllinsta"
    }
  });
}
main()
  .then(() => prisma.$disconnect())
  .catch(async(e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });