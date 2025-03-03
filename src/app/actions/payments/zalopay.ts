import { zalopayConfig } from "@/lib/const";
import axios from "axios";
import { HmacSHA256 } from "crypto-js";
import moment from "moment";

export type ZaloPayInputProps = {
  app_trans_id: string;
  app_user: string;
  amount: number;
  description: string;
  items: Array<any>;
};
export async function ZaloPay({ props }: { props: ZaloPayInputProps }) {
  try {
    const embed_data = {
      redirecturl: `${process.env.NEXT_PUBLIC_API_URL}/success`,
    };
    const items: any = props.items;

    const order = {
      app_id: zalopayConfig.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${props.app_trans_id}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: props.app_user,
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: props.amount,
      callback_url: `${process.env.NEXT_PUBLIC_API_URL}/success`,
      description: props.description,
      bank_code: "",
      mac: "",
    };

    console.log(order);

    const transaction_id = order.app_trans_id;
    const data =
      zalopayConfig.app_id +
      "|" +
      order.app_trans_id +
      "|" +
      order.app_user +
      "|" +
      order.amount +
      "|" +
      order.app_time +
      "|" +
      order.embed_data +
      "|" +
      order.item;
    order.mac = HmacSHA256(data, zalopayConfig.key1).toString();

    const result = await axios.post(zalopayConfig.endpoint, null, {
      params: order,
    });

    const customResult = { ...result.data, transaction_id: transaction_id };
    return customResult;
  } catch (error) {
    return false;
  }
}
