"use server"
import { z } from "zod"
import { ZaloPay } from "./zalopay"
// import prismadb from "@/lib/prisma"
import { paymentSchema } from "@/app/schema"
import { handlePayOs } from "./payos";

export type GenerateSignatureProps = {
  amount: string;
  cancelUrl: string;
  description: string;
  orderCode: string;
  returnUrl: string;
};

type Props = {
  values: z.infer<typeof paymentSchema>,
  paymentMethod: string,
}
export async function handlePaymentAction({ values, paymentMethod }: Props): Promise<any> {
  const validData = paymentSchema.safeParse(values).data
  console.log(values)
  if(!validData){
    return ({ data: null, isSuccess: false, message: "Định dạng dữ liệu sai" })
  }
  if (paymentMethod == 'payos') {
    const billProps: GenerateSignatureProps = {
      orderCode: validData.option,
      amount: validData.subtotal.toString(),
      description: `${validData.productName.split(' ').slice(-1)[0]}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_API_URL}/profile/booking-history`,
      returnUrl: `${process.env.NEXT_PUBLIC_API_URL}/profile/booking-history`,
    }
    console.log(billProps)

    const paymentResponse = await handlePayOs({ props: billProps })
    try {
      if (!paymentResponse.isSuccess) {
        return ({ data: null, isSuccess: false, message: "Payos hiện đang dừng họat động, vui lòng chọn phương thức thanh toán khác" })

      }
      if (paymentResponse.isSuccess) {
          // const updatedRequest = await prismadb.request.update({
          //   where: {
          //     id: +requestId
          //   }, data: {
          //     paymentLink: paymentResponse?.data?.checkoutUrl + "",
          //     transactionId: paymentResponse?.data?.paymentLinkId
          //   }
          // })
        return ({ data: paymentResponse.data, isSuccess: true, message: "success" })
      }
    } catch (e) {
      // await prismadb.requestOnStaff.deleteMany({
      //   where: {
      //     requestId: +requestId,
      //   }
      // })
      // await prismadb.request.delete({ where: { id: +requestId } })
      return ({ data: null, isSuccess: false, message: "failed when create payment link at payos" })
    }
  } else if (paymentMethod == "payos") {
    try {

      const zalopayPaymentResponse = await ZaloPay({ props: { description: `Thanh toan cho san pham: ${validData.productName}`, amount: +validData.subtotal, app_trans_id: validData.option, app_user: validData.userId, items: [] } })
      console.log(zalopayPaymentResponse);
      if (!zalopayPaymentResponse) {
        return ({ data: null, isSuccess: false, message: "Vui long thu lai" })
      }
      if (zalopayPaymentResponse.return_code == 1) {
        // const updatedRequest = await prismadb.request.update({
        //   where: {
        //     id: +requestId
        //   }, data: {
        //     paymentLink: zalopayPaymentResponse?.order_url + "",
        //     transactionId: zalopayPaymentResponse?.transaction_id
        //   }
        // })
        return ({ data: zalopayPaymentResponse, isSuccess: true, message: "success" })
      }else{
        return ({ data: null, isSuccess: false, message: "Zalopay hiện đang dừng họat động, vui lòng chọn phương thức thanh toán khác" })
      }
    } catch (e) {
      // await prismadb.requestOnStaff.deleteMany({
      //   where: {
      //     requestId: +requestId,
      //   }
      // })
      // await prismadb.request.delete({ where: { id: +requestId } })
      return ({ data: null, isSuccess: false, message: "error" })
    }
    return ({ data: null, isSuccess: false, message: "error" })
  } else {
    return ({ data: null, isSuccess: false, message: "Phương thức thanh toán không h��p lệ" })
  }
}
