"use client";

import Image from "next/image";
import { useCartStore } from "@/hooks/useCartStore";
import { media as wixMedia } from "@wix/sdk";
import { useWixClient } from "@/hooks/useWixClient";
import { currentCart } from "@wix/ecom";
import formatMoney from "@/lib/currencyFormater";
import { handlePaymentAction } from "@/app/actions/payments/handle-payment";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import Marquee from 'react-fast-marquee'
import { createProduct } from "@/app/actions/product/create-product";
import { createProductsFromCart } from "@/app/actions/product/create-many-product";

const CartModal = () => {
  // TEMPORARY
  // const cartItems = true;
  const router = useRouter();
  const wixClient = useWixClient();
  const { cart, isLoading, removeItem } = useCartStore();
  const { isSignedIn, user, isLoaded } = useUser()

  const handleCheckout = async () => {
    // if (!isSignedIn) {
    //   toast.error('Please login to continue')
    //   return
    // }
    const paymentValues = {
      id: Math.floor(Math.random() * 10000),
      productName: cart.lineItems?.map(item => item.productName) ? cart.lineItems?.map(item => item.productName?.original).toString() : 'product empty',
      //@ts-ignore
      subtotal: +cart.subtotal.amount,
      userId: user?.id ? user?.id : 'guest',
      option: `${Math.floor(Math.random() * 100)}${Math.floor(Math.random() * 100)}${Math.floor(Math.random() * 100)}${Math.floor(Math.random() * 100)}${cart.lineItems?.map(item => item.quantity)}${Math.floor(Math.random() * 1000)}`,
    };
    createProductsFromCart(cart.lineItems)
    // const paymentResponse = await handlePaymentAction(
    //   {
    //     paymentMethod: 'payos',
    //     values: paymentValues
    //   }
    // );
    // if (paymentResponse.isSuccess) {
    //   if (paymentResponse.data.order_url) {
    //     router.push(paymentResponse.data.order_url)
    //   } else {
    //     router.push(paymentResponse.data.checkoutUrl)
    //   }
    // }

  };

  return (
    <div className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20">
      {!cart.lineItems ? (
        <div className="">Cart is Empty</div>
      ) : (
        <>
          <h2 className="text-xl">Shopping Cart</h2>
          {/* LIST */}
          <div className="flex max-h-[400px] flex-col gap-8 overflow-auto">
            {/* ITEM */}
            {cart.lineItems.map((item) => (
              <div className="flex gap-4" key={item._id}>
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
                        {item.productName?.original}
                      </h3>
                      </Marquee>
                      <div className="p-1 bg-gray-50 rounded-sm flex items-center gap-2">
                        {item.quantity && item.quantity > 1 && (
                          <div className="text-xs text-green-500">
                            {item.quantity} x{" "}
                          </div>
                        )}
                        {item?.price?.formattedAmount}
                      </div>
                    </div>
                    {/* DESC */}
                    <div className="text-sm text-gray-500">
                      {item.availability?.status}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.descriptionLines?.map((line, index) => {
                        return (
                          <div key={index}>
                            <p>{line.name?.original}: {line?.plainText?.original}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* BOTTOM */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Qty. {item.quantity}</span>
                    <span
                      className="text-blue-500"
                      style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
                      onClick={() => removeItem(wixClient, item._id!)}
                    >
                      Remove
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* BOTTOM */}
          <div className="">
            <div className="flex items-center justify-between font-semibold">
              <span className="">Subtotal</span>
              {/* @ts-ignore */}
              <span className="">{cart.subtotal.formattedAmount} </span>
            </div>
            <p className="text-gray-500 text-sm mt-2 mb-4">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="flex justify-between text-sm">
              <button className="rounded-md py-3 px-4 ring-1 ring-gray-300">
                View Cart
              </button>
              <button
                className="rounded-md py-3 px-4 bg-black text-white disabled:cursor-not-allowed disabled:opacity-75"
                disabled={isLoading}
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartModal;

