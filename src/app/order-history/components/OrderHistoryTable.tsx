"use client";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { media as wixMedia } from "@wix/sdk";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@/lib/const";
import formatMoney from "@/lib/currencyFormater";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

type Order = {
    id: string;
    status: string;
    amount: string;
    createdAt: string;
    products: any[];
};

export function OrderHistoryTable({ orders }: { orders: Order[] }) {

    const searchParams = useSearchParams();
    const [currentStatus, setCurrentStatus] = useState<string>("processing");
    const [currentOrderId, setCurrentOrderId] = useState<number>();
    const clerkUser = useUser();
    const router = useRouter();
    useEffect(() => {
        const apptransid = searchParams.get("apptransid") ?? "";
        const status = searchParams.get("status") ?? ""
        orders.forEach((e, index) => {
            const splittedString = apptransid.split("_")
            if (splittedString.length < 1) {
                return;
            }
            const orderId = splittedString[1];
            if (orderId == e.id) {
                setCurrentOrderId(index)
                if(+status < 0){
                    setCurrentStatus('canceled')
                }else if(+status == 1){
                    setCurrentStatus('paid')
                    router.push(`/success?orderId=${orderId}`)
                }
                return
            }
        })
    async function updateOrder({ appTransId, status, userId }: { appTransId: string, status: string, userId: string }) {
        const res = await fetch("/api/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                appTransId: appTransId,
                status: status,
                userId: userId
            }),
        });

        const data = await res.json();
    }
    if (clerkUser.isSignedIn) {
        updateOrder({ appTransId: apptransid, status: status, userId: clerkUser?.user.id })
    } else {
        //toast.error("Please login to update order status")
    }
}, [searchParams, clerkUser.isLoaded]); // Runs when search params change
return (
    <Table>
        <TableHeader className="border-b border-gray-200">
            <TableRow>
                <TableHead className="w-4">Number</TableHead>
                <TableHead className="text-center">Products</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Amount</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {orders.length > 0 ? (
                orders.map((order, index) => (
                    <TableRow key={order.id}>
                        <TableCell className="font-medium border-r border-gray-200 text-center">{index + 1}</TableCell>
                        <TableCell className="border-r border-gray-200 text-center">
                            {order.products.map((product, index) => (
                                <div key={product.product.id} className="" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Image
                                        src={wixMedia.getScaledToFillImageUrl(
                                            product.product.image,
                                            72,
                                            96,
                                            {}
                                        )}
                                        alt=""
                                        width={72}
                                        height={96}
                                        className="object-cover rounded-md"
                                    />
                                    <span>{product.product.productNameOriginal}</span>
                                </div>
                            ))}
                        </TableCell>
                        <TableCell className="border-r border-gray-200 text-center">
                            <span className={cn("text-white px-4 py-2 rounded-md font-bold",
                                (index == currentOrderId ? currentStatus : order.status) == OrderStatus.Processing && "bg-yellow-200 text-yellow-800",
                                (index == currentOrderId ? currentStatus : order.status) == OrderStatus.Paid && "bg-blue-200 text-blue-800",
                                (index == currentOrderId ? currentStatus : order.status) == OrderStatus.Delivered && "bg-blue-200 text-blue-800",
                                (index == currentOrderId ? currentStatus : order.status) == OrderStatus.Completed && "bg-green-200 text-green-800",
                                (index == currentOrderId ? currentStatus : order.status) == OrderStatus.Canceled && "bg-red-200 text-red-800",
                            )}>
                                {index == currentOrderId ? currentStatus : order.status}
                            </span>
                        </TableCell>
                        <TableCell className="text-right">{formatMoney(+order.amount)} VND</TableCell>
                    </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={4} className="text-center">
                        No orders found.
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
    </Table>
);
}
