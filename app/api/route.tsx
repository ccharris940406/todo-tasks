import { NextResponse } from "next/server";
import { prisma } from "../prismaClient";

export async function GET(_: Request, response: Response) {
  const tasks = await prisma.category.findMany();
  return NextResponse.json(tasks);
}
