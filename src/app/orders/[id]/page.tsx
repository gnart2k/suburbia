import { getProductsAction } from "@/app/actions/product/get-product";
import OrderForm from "@/components/OrderForm";
import ProductListView from "@/components/ProductListView";

export default async function OrderPage({ params: { id } }: { params: { id: string } }) {
  let quantityList:number[] = []
  const splittedIds = id.split('%7C').map((item) => {
    const quantity = item.split('%5E')[1]
    quantityList.push(+quantity)
    if(item.length > 4){
      return item.slice(0, -4);
    }
    return item
  });
  const productList = await getProductsAction(splittedIds);
  return (
    <div className="flex w-full h-full justify-center items-center justify-center">
      <div className="m-8 w-4/12 border rounded-lg border-gray-300 p-4 mt-20">
        <ProductListView items={productList} quantity={quantityList} />
      </div>
      <div>
        <OrderForm productList={splittedIds} quantity={quantityList}/>
      </div>
    </div>
  )
}