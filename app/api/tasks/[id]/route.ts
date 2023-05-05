import { prisma } from "@/app/prismaClient";
import { NextResponse } from "next/server";

type Id = {
  id: number;
};

export async function PUT(req: Request, { params }: { params: Id }) {
  const name = await req.json();
  const id: number = +params.id;

  const updateTask = await prisma.task.update({
    where: {
      id: id,
    },
    data: {
      title: name.title ?? name.title,
      categoryId: name.categoryId ?? name.categoryId,
      completed: name.completed ?? name.completed,
      canceled: name.canceled ?? name.canceled,
    },
  });
  return new Response(`cambio en la tarea ${params.id}`, { status: 201 });
}

export async function DELETE(req: Request, { params }: { params: Id }) {
  const id: number = +params.id;
  const getTask = await prisma.task.delete({
    where: {
      id: id,
    },
  });

  return NextResponse.json(getTask);
}

export async function GET(req: Request, { params }: { params: Id }) {
  const id: number = +params.id;
  const getTask = await prisma.task.findUnique({
    where: {
      id: id,
    },
  });

  return NextResponse.json(getTask);
}
