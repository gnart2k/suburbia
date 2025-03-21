"use server"

import prismadb from "@/lib/prisma"
import { updateUserInfo } from "./user-action"
import { OrderFormSchema } from "@/app/schema"
import { z } from "zod"
import { ProductPrismaType } from "@/lib/utils"
import { handlePaymentAction } from "../payments/handle-payment"
import { redirect } from "next/navigation"

export async function createOrder({ values, subtotal }: { values: z.infer<typeof OrderFormSchema>, subtotal:number}) {
    try {
        const userInfo = await updateUserInfo({ values: values })
        if (!userInfo.isSuccess) return { isSuccess: false }

        const createdOrder = await prismadb.order.create({
            data: {
                amount: "",
                userInfoid: values.userId ?? "",
            }
        })
        
        if (!createdOrder) return { isSuccess: false }
        if (values.productList == undefined || values.productList.length <= 0) return { isSuccess: false }
        
        const orderProducts = await prismadb.orderProduct.createMany({
            data: values.productList.map((productId) => ({
                orderId: createdOrder.id,
                productId: productId,
            })),
            skipDuplicates: true, // Prevents duplicate entries if they exist
        });
        
        if (orderProducts.count > 0) {
            
            const _productList: ProductPrismaType[] = await prismadb.product.findMany({
                where: {
                    id: { in: values.productList }, // Query all productIds at once
                }
            });
            
            await prismadb.order.update({
                where: {
                    id: createdOrder.id,
                },
                data: {
                    amount: subtotal.toString(),
                }
            })

            const paymentValues = {
                id: Math.floor(Math.random() * 10000),
                productName: _productList.map(item => item.productNameOriginal) ? _productList.map(item => item.productNameOriginal).toString() : 'product empty',
                //@ts-ignore
                subtotal: subtotal,
                userId: values.userId ? values.userId : 'guest',
                option: `${Math.floor(Math.random() * 100)}${Math.floor(Math.random() * 100)}${Math.floor(Math.random() * 100)}${Math.floor(Math.random() * 100)}${Math.floor(Math.random() * 1000)}`,
                orderId: createdOrder.id
            };

            const paymentResponse = await handlePaymentAction(
                {
                    paymentMethod: 'zalopay',
                    values: paymentValues
                }
            );

            if (paymentResponse.isSuccess) {
                return { isSuccess: true, data: paymentResponse?.data}
            }
        }
    } catch (e) {
        console.log(e)
    }
}