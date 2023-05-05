import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const createUncategorized = async () => {
  await prisma.category.create({
    data: {
      title: "uncategorized",
      color: "",
    },
  });
};

createUncategorized().catch((err) => {
  console.log(err);
});
