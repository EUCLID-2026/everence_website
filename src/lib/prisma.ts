import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const clientModule = require("@prisma/client");
    if (clientModule && clientModule.PrismaClient) {
      return new clientModule.PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
      });
    }
  } catch {
    // Fallback if not yet generated locally prior to Docker run
  }
  return new (class MockPrismaClient {})() as unknown as PrismaClient;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
