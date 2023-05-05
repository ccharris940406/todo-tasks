import { PrismaClient } from "@prisma/client";

const GlobalPrisma = globalThis as unknown as {
    prisma: PrismaClient
}

export const prisma = GlobalPrisma.prisma ?? new PrismaClient()