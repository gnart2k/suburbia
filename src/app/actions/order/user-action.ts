"use server"
import { OrderFormSchema } from "@/app/schema";
import prismadb from "@/lib/prisma";
import { z } from "zod";

export async function updateUserInfo({ values }: { values: z.infer<typeof OrderFormSchema> }): Promise<ActionResponseType> {
    try {
        const validationResult = OrderFormSchema.safeParse(values);
        if (!validationResult.success) {
            return { data: null, isSuccess: false, message: "Định dạng dữ liệu sai" };
        }
        
        const validData = validationResult.data;
        
        // const userInfo = await prismadb.userInfo.create({
        //     data: {
        //         id: validData.userId,
        //         addressDetail: validData.addressDetail ?? "",
        //         district: validData.district,
        //         email: validData.email,
        //         firstName: validData.firstName,
        //         lastName: validData.lastName,
        //         phone: validData.phone,
        //         province: validData.province,
        //         ward: validData.ward,
        //         shippingAddress: validData.shippingAddress,
        //     }
        // })

        const userInfo = await prismadb.userInfo.upsert({
            where:{
                id: validData.userId ?? ""
            },
            update:{
                addressDetail: validData.addressDetail ?? "",
                district: validData.district,
                email: validData.email,
                firstName: validData.firstName,
                lastName: validData.lastName,
                phone: validData.phone,
                province: validData.province,
                ward: validData.ward,
                shippingAddress: validData.shippingAddress,
            },
            create:{
                id: validData.userId,
                addressDetail: validData.addressDetail ?? "",
                district: validData.district,
                email: validData.email,
                firstName: validData.firstName,
                lastName: validData.lastName,
                phone: validData.phone,
                province: validData.province,
                ward: validData.ward,
                shippingAddress: validData.shippingAddress,
            }
        })

        console.log("user Info: " + userInfo)
        
        return { data: validData, isSuccess: true, message: "Success" };
    } catch (e) {
        return { data: null, isSuccess: false, message: "Error processing request" };
    }
}


export async function getUserAddress():Promise<ActionResponseType>{
    return { data: null, isSuccess: false, message: "Error processing request" };

}
