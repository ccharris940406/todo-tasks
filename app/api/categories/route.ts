import { prisma } from "@/app/prismaClient";
import { Category } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const getCategories = await prisma.category.findMany();
  return NextResponse.json(getCategories);
}

export async function POST(req: Request) {
  const data: Category = await req.json();
  const createCategory = prisma.category.create({
    data: {
      title: data.title,
      color: data.color,
    },
  });

  return NextResponse.json((await createCategory).id, { status: 200 });
}
