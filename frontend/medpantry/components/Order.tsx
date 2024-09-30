'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from './ui/separator';
import OrderLine from '@/components/OrderLine';
import { useRouter } from "next/navigation";

interface Data {
    quantity: number;
    itemName: string;
}

interface OrderProps {
    orderNumber: string;
    datas: Data[];
    boxes: number[];
    displayTakeOrderButton: boolean;
}

export default function Order({ orderNumber, datas = [], boxes = [], displayTakeOrderButton }: OrderProps) {
    const router = useRouter();

    const isDataValid = (data: any): data is Data => {
        return typeof data === 'object' && data !== null &&
            typeof data.quantity === 'number' &&
            typeof data.itemName === 'string';
    };

    const takeOrder = async (orderNumber: string) => {
        try {
            const value: string = encodeURIComponent(orderNumber);
            console.log(value);
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/HandleOrderAccept?orderNumber=${value}`, {
                method: 'PATCH',
            });
            if (!res.ok) throw new Error('Network response was not ok');
            const result = await res.json();
            console.log('Order accepted:', result);

            // Redirect to /take-order with query parameters
            const queryParams = new URLSearchParams({
                orderNumber,
                datas: JSON.stringify(datas),
                boxes: JSON.stringify(boxes),
            }).toString();
            router.push(`/take-order?${queryParams}`);
        } catch (error) {
            console.error('Error taking order:', error);
        }
    };

    return (
        <div className={`bg-secondary-foreground border-solid border-border rounded-md p-4 flex flex-col gap-2`}>
            <div className="flex flex-row gap-4 w-full items-center">
                <h1 className="text-2xl font-bold">Order {orderNumber}</h1>
                {displayTakeOrderButton && (
                    <Button
                        className='bg-red-600 text-white p-2'
                        onClick={() => takeOrder(orderNumber)}
                    >
                        Take Order
                    </Button>
                )}
            </div>
            <Separator />
            {datas.length > 0 ? (
                datas.filter(isDataValid).map((data, index) => (
                    <OrderLine
                        key={index}
                        name={data.itemName}
                        quantity={data.quantity}
                        boxNumbers={boxes}
                    />
                ))
            ) : (
                <p>No items found in this order.</p>
            )}
        </div>
    );
}
