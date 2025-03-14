"use client"
import Image from "next/image";
import { useCartStore } from "@/hooks/useCartStore";
import { media as wixMedia } from "@wix/sdk";
import Marquee from "react-fast-marquee";
import { Prisma } from "@prisma/client";
import formatMoney from "@/lib/currencyFormater";
import { ProductPrismaType } from "@/lib/utils";


export default function ProductListView({items, quantity}: {items:ProductPrismaType[], quantity: number[]}){
  const totalAmount = items.reduce((sum, item, index) => sum + (item.convertedPriceAmount * quantity[index]), 0);
    return(
      <div>
          <div className="flex max-h-[400px] min-h-[400px] flex-col gap-8 overflow-auto">
            {/* ITEM */}
            {items.map((item,index) => (
              <div className="flex gap-4 border rounded-lg p-4" key={item.id}>
                {item.image && (
                  <Image
                  src={wixMedia.getScaledToFillImageUrl(
                    item.image,
                      72,
                      96,
                      {}
                    )}
                    alt=""
                    width={72}
                    height={96}
                    className="object-cover rounded-md"
                  />
                )}
                <div className="flex flex-col justify-between w-full">
                  {/* TOP */}
                  <div className="">
                    {/* TITLE */}
                    <div className="flex items-center justify-between gap-8">
                      <Marquee className="max-w-[400px]" play={false}>
                      <h3 className="font-semibold">
                        {item.productNameOriginal}
                      </h3>
                      </Marquee>
                      <div className="p-1 bg-gray-50 rounded-sm flex items-center gap-2">
                        {item.quantity && item.quantity > 1 && (
                          <div className="text-xs text-green-500">
                            {item.quantity} x{" "}
                          </div>
                        )}
                        {item?.convertedPriceFormatted}
                      </div>
                    </div>
                    {/* DESC */}
                    <div className="text-sm text-gray-500">
                      {item.availabilityStatus}
                    </div>
                  </div>
                  {/* BOTTOM */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Qty. {quantity[index]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
            <div className="font-bold">
              Total: {formatMoney(totalAmount)}VND
            </div>
            </div>
    )
}