"use server"

import prismadb from "@/lib/prisma"

export async function createOrder({values}: {values: OrderType}){
    try{
        await prismadb.order.create({
            data: values
        })
    }catch(e){
        console.log(e)
    }
}