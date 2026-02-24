import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // Prefer Prisma Accelerate if present
  const accelerateUrl = process.env.PRISMA_ACCELERATE_URL || process.env.NEXT_PUBLIC_PRISMA_ACCELERATE_URL;
  const databaseUrl = process.env.DATABASE_URL;
  // Determine installed @prisma/client major version (if available) and only
  // attempt the newer `adapter` / `accelerateUrl` constructor options when
  // running with Prisma v7+ to avoid runtime initialization errors for older
  // clients.
  let prismaClientMajor = 0;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pkg = require("@prisma/client/package.json");
    const v = pkg?.version;
    if (v) prismaClientMajor = parseInt(String(v).split(".")[0], 10) || 0;
  } catch (err) {
    // ignore — package.json not available at runtime
  }

  if (prismaClientMajor >= 7) {
    try {
      if (accelerateUrl) {
        return new PrismaClient(({
          accelerateUrl,
        } as unknown) as any);
      }

      if (databaseUrl) {
        return new PrismaClient(({
          adapter: { type: "postgres", url: databaseUrl },
        } as unknown) as any);
      }
    } catch (err) {
      // If something unexpected goes wrong with the new constructor options,
      // fall back to the default constructor below.
      // eslint-disable-next-line no-console
      console.warn(
        "PrismaClient (v7+) initialization with adapter/accelerateUrl failed, falling back:",
        (err as any)?.message ?? String(err)
      );
    }
  }

  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
