import { z } from "zod";

export const paymentSchema = z.object({
    id: z.number(),
    productName: z.string(),
    subtotal: z.number(),
    userId: z.string(),
    option: z.string(),
})