import PayOS from "@payos/node";
import { GenerateSignatureProps } from "./handle-payment";

export async function handlePayOs({ props }: { props: GenerateSignatureProps }) {
  const payOS = new PayOS(
    process.env.x_client_id,
    process.env.x_api_key,
    process.env.checksum
  );
  try {
    const body = {
      orderCode: +props.orderCode,
      amount: +props.amount,
      description: props.description,
      cancelUrl: props.cancelUrl,
      returnUrl: props.returnUrl,
    };
    console.log(body)

    //@ts-ignore
    const paymentLinkRes = await payOS.createPaymentLink(body);
    console.log(paymentLinkRes)
    return { data: paymentLinkRes, isSuccess: true, message: "success pay with payos" }
  } catch (error) {
    //@ts-ignore
    console.log(error.message)
    //@ts-ignore
    return { data: null, isSuccess: false, message: error.message }

  }
}

