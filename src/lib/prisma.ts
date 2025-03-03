import { PrismaClient } from "@prisma/client";
declare global {
  var prisma: PrismaClient | undefined;
}

let prismadb = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prismadb;
} else {
  prismadb = new PrismaClient();
}

export default prismadb;

