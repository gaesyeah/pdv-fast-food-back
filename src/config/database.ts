import { PrismaClient } from '@prisma/client';

// eslint-disable-next-line import/no-mutable-exports
export let prisma: PrismaClient;
export function connectDb(): void {
  prisma = new PrismaClient();
}

export async function disconnectDB(): Promise<void> {
  await prisma?.$disconnect();
}
