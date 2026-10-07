import { PrismaClient } from '@prisma/client';

const createPrismaClient = () =>
  new PrismaClient().$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const before = Date.now();
          const result = await query(args);
          const after = Date.now();
          console.log(`Query ${model}.${operation} took ${after - before}ms`);
          return result;
        },
      },
    },
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
