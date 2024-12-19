import { PrismaClient } from '@prisma/client';

export let prisma: PrismaClient;
export function connectDb(): void {
  prisma = new PrismaClient();
}

export async function cleanDb() {
  await prisma.ticket.deleteMany({});
  await prisma.event.deleteMany({});
}