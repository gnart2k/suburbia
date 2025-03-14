"use server"
import prismadb from "@/lib/prisma"
import { ProductPrismaType } from "@/lib/utils";


export async function getProductsAction(productIds: string[]) {
  if (!productIds.length) return [];

  const response: ProductPrismaType[] = await prismadb.product.findMany({
    where: {
      id: { in: productIds }, // Query all productIds at once
    },
  });

  return response;
}