export const zalopayConfig = {
    app_id: "2553",
    key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
    key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

export const addressApi = 'https://provinces.open-api.vn/api'

export enum OrderStatus {
    Processing = "processing",
    Paid = "paid",
    Delivered = "delivered",
    Canceled = "canceled",
    Completed = "completed",
  }