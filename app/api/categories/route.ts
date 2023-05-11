import { prisma } from "@/app/prismaClient";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const getCategories = await prisma.category.findMany();
  return NextResponse.json(getCategories);
}
