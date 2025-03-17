import { OrderStatus } from "@/lib/const";
import prismadb from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse JSON body
    const body = await req.json();
    const { appTransId, status, userId } = body;
    const orderId = appTransId.split("_")[1];
    if(+status <= 0){
        const updatedOrder = await prismadb.order.update({
            where:{
                userInfoid: userId,
                id: orderId
            },
            data:{
                status: OrderStatus.Canceled
            }
        })
        console.log(updatedOrder)
    }else if(+status >0){
        const updatedOrder = await prismadb.order.update({
            where:{
                userInfoid: userId,
                id: orderId
            },
            data:{
                status: OrderStatus.Paid
            }
        })
        console.log(updatedOrder)
    }

    // Validate parameters
    if (!appTransId || !status || !userId) {
      return NextResponse.json(
        { error: "Missing appTransId, status, or userId" },
        { status: 400 }
      );
    }

    // Process the data (e.g., update order status in the database)
    console.log("Received:", { appTransId, status, userId });

    return NextResponse.json(
      { message: "Success", appTransId, status, userId },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 500 }
    );
  }

  
}
