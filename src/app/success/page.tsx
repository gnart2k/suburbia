"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Confetti from "react-confetti";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) return;

    // const fetchOrder = async ()=>{
    //   const res = await fetch('/api/order/order-details', {
    //     method: 'POST', 
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ orderId }),
    //   });

    //   console.log(res)
    // }

    // fetchOrder()

    // Gọi API gửi email invoice
    const sendInvoice = async () => {
      try {
        const response = await fetch('/api/send-mail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId }),
          
        });
        console.log(response + 'success');

        
       
        if (!response.ok) {
          const data = await response.json();
          console.error('Error sending invoice:', data.error);
        } else {
          const data = await response.json();
          console.log('Invoice sent:', data.message);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    sendInvoice();

    // const timer = setTimeout(() => {
    //   router.push("/order-history/");
    // }, 5000);

    // return () => {
    //   clearTimeout(timer);
    // };
  }, [orderId, router]);

  return (
    <div className="flex flex-col gap-6 items-center justify-center h-[calc(100vh-180px)]">
      <Confetti width={2000} height={1000} />
      <h1 className="text-6xl text-green-700">Successful</h1>
      <h2 className="text-xl font-medium">
        We sent the invoice to your e-mail
      </h2>
      <h3 className="">You are being redirected to the order page...</h3>
    </div>
  );
};

export default SuccessPage;
