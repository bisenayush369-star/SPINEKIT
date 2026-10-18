type PrismaClientLike = Record<string, unknown>;

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClientLike;
};

export const prisma: PrismaClientLike = globalForPrisma.prisma ?? {};

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}