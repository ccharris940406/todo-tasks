import { prisma } from "@/app/prismaClient";

type Category = {
  title: string;
  color: string;
};

export async function POST(req: Request, { params }: { params: Category }) {
  const createCategory = await prisma.category.create({
    data: {
      title: params.title,
      color: params.color,
    },
  });

  return new Response(createCategory.title, { status: 201 });
}
