import { z } from "zod";

export const paymentSchema = z.object({
    id: z.number(),
    productName: z.string(),
    subtotal: z.number(),
    userId: z.string(),
    option: z.string(),
    orderId: z.string().optional()
})

export const OrderFormSchema = z.object({
    userId: z.string().optional(),
    firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
    shippingAddress: z.string().min(5, { message: "Shipping address must be at least 5 characters." }),
    province: z.string().min(1, { message: "Please select a province." }),
    district: z.string().min(1, { message: "Please select a district." }),
    ward: z.string().min(1, { message: "Please select a ward." }),
    addressDetail: z.string().optional(),
    productList: z.array(z.string()).optional(),
})
