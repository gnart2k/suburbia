import prismadb from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse JSON body
    const body = await req.json();
    const { orderId } = body;
    console.log(orderId)
    if (!orderId) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const response = await prismadb.order.findUnique({
      where:{
        id: orderId
      },
      include:{
        products: true, 
      }
      

    })
    console.log(response)
    return NextResponse.json(
      { message: "Success" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 500 }
    );
  }

  
}
