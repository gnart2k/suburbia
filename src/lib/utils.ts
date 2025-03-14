import { Prisma } from "@prisma/client";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const productPrisma = Prisma.validator<Prisma.ProductFindFirstArgs>()({});

export type ProductPrismaType = Prisma.ProductGetPayload<typeof productPrisma>;
