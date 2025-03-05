type OrderType = {
    id: string;
    userInfoid: string;
    status?: "processing" | "paid" | "delivered" | "canceled" | "completed";
    amount: string;
    paymentUrl?: string | null;
    createdAt: Date;
    updatedAt?: Date | null;
}