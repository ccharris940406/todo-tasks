import { prisma } from "@/app/prismaClient";
import { NextResponse } from "next/server";

type Task = {};

export async function GET() {
  const tasks = await prisma.task.findMany();
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const addTask = await prisma.task.create({
    data: {
      title: " ",
      category: {
        connect: { id: 1 },
      },
    },
  });

  return new Response("added new task", { status: 201 });
}
