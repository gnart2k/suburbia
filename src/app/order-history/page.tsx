import prismadb from "@/lib/prisma";
import { OrderHistoryTable } from "./components/OrderHistoryTable";
import { auth } from "@clerk/nextjs/server";

export default async function OrdersPage() {
  const {userId} = await auth();
  const orders = await prismadb.order.findMany({
    include: {
      products: {
        include: {
          product: true
        }
      }
    },
    where: {
      userInfoid: userId ?? ""
    },
    orderBy:{
      createdAt: "desc"
    }
  });

  return (
  <div className="m-20 border rounded-lg ">
    <OrderHistoryTable orders={orders} />
    </div>
  )
}
