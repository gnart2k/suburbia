import { getProductsAction } from "@/app/actions/product/get-product";
import OrderForm from "@/components/OrderForm";
import ProductListView from "@/components/ProductListView";

export default async function OrderPage({ params: { id } }: { params: { id: string } }) {
  return (
    <div className="flex w-full h-full justify-center items-center justify-center">
      <div className="m-8 w-4/12 border rounded-lg border-gray-300 p-4 mt-20">
        <ProductListView/>
      </div>
      <div>
        <OrderForm/>
      </div>
    </div>
  )
}