'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import OrderLine from '@/components/OrderLine';
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/TableCard";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { Package } from "lucide-react";

interface Data {
  quantity: number;
  itemName: string;
}

interface OrderProps {
  orderNumber: string;
  datas: Data[];
  boxes: number[][];
  displayTakeOrderButton: boolean;
}

const isDataValid = (data: any): data is Data => {
  return typeof data === 'object' && data !== null &&
    typeof data.quantity === 'number' &&
    typeof data.itemName === 'string';
};

/*A user can take an order, which removes the order card from the pending order list.
  After taking an order, the user will be redirected to protected/take-order page, where they will press the "done" button to complete the order.
  takeOrder() is called onClick of take order button.*/
async function takeOrder(orderNumber: string, datas: Data[], boxes: number[], router: any) {
  try {
    const value: string = encodeURIComponent(orderNumber);
    console.log(value);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/TakeOrder?orderNumber=${value}`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Network response was not ok");
    console.log("Order taken:", res);

    // Redirect to /take-order page with query parameters
    const queryParams = new URLSearchParams({
      orderNumber,
      datas: JSON.stringify(datas),
      boxes: JSON.stringify(boxes),
    }).toString();
    router.push(`/protected/take-order?${queryParams}`);
  } catch (error) {
    console.error("Error taking order:", error);
  }
}

export default function Order({ orderNumber, datas = [], boxes = [], displayTakeOrderButton }: OrderProps) {
  const router = useRouter();

  return (
    <Card
      key={orderNumber}
      className="border-gray-200 shadow-md rounded-xl w-full flex flex-col items-center"
    >
      <CardHeader className="flex flex-row items-center justify-between bg-white w-full p-6">
        <CardTitle className="text-gray-800 flex items-center flex-wrap">
          <span className="text-2xl font-bold flex items-center">
            <Package className="mr-2 h-6 w-6 text-red-600" />
            Order {orderNumber}
          </span>
        </CardTitle>
        {displayTakeOrderButton && (
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => takeOrder(orderNumber, datas, boxes, router)}>
            Take Order
          </Button>
        )}
      </CardHeader>
      <CardContent className="w-full bg-white p-6">
        <Table className="ml-auto mr-auto">
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50 border-gray-100">
              <TableHead className="text-gray-600">
                <span className="flex items-center">Item</span>
              </TableHead>
              <TableHead className="text-gray-600 text-center">
                <span className="flex items-center">Total Quantity</span>
              </TableHead>
              <TableHead className="text-gray-600">
                <span className="flex items-center">Warehouse Location</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {datas.length > 0 ? (
              datas.filter(isDataValid).map((data, index) => (
                <OrderLine
                  key={index}
                  itemName={data.itemName}
                  quantity={data.quantity}
                  boxNumbers={boxes[index]}
                />
              ))
            ) : (
              <p>No items found in this order.</p>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
