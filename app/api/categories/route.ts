import { prisma } from "@/app/prismaClient";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  console.log("here GET");
  const categories = await prisma.category.findMany();
  return NextResponse.json(categories);
}
