import { prisma } from "@/app/prismaClient";
import { NextResponse } from "next/server";

type Id = {
  id: number;
};

export async function DELETE(req: Request, { params }: { params: Id }) {
  const id: number = +params.id;
  if (id === 1) throw new Error("Failed delet category");

  const category = await prisma.category.delete({ where: { id: id } });
  return NextResponse.json(category);
}

export async function GET(req: Request, { params }: { params: Id }) {
  const id: number = +params.id;
  console.log("Id");
  const category = await prisma.category.findUnique({
    where: { id: id },
  });
  return NextResponse.json(category);
}
