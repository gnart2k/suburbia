import prismadb from "@/lib/prisma";
import { OrderHistoryTable } from "./components/OrderHistoryTable";

export default async function OrdersPage() {
  const orders = await prismadb.order.findMany({
    include: {
      products: {
        include: {
          product: true
        }
      }
    }
  });

  return (
  <div className="m-20 border rounded-lg ">
    <OrderHistoryTable orders={orders} />
    </div>
  )
}
