import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from './ui/separator';
import OrderLine from '@/components/OrderLine';

interface OrderProps {
  orderNumber: string;
  cards: { quantity: string; sku: string }[];
}

export default function Order({ orderNumber, cards = [] }: OrderProps) {
  return (
    <Card
      key={order.orderNumber}
      className=" border-gray-200 shadow-md rounded-xl w-full flex flex-col items-center"
    >
      <CardHeader className="flex flex-row items-center justify-between bg-white w-full p-6">
        <CardTitle className="text-gray-800 flex items-center flex-wrap">
          <span className="text-2xl font-bold flex items-center">
            <Package className="mr-2 h-6 w-6 text-red-600" />
            Order {order.orderNumber}
          </span>
        </CardTitle>
        <Button className="bg-red-600 hover:bg-red-700 text-white">
          Take Order
        </Button>
      </CardHeader>
      <CardContent className="w-full bg-white p-6">
        <Table className="ml-auto mr-auto">
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50 border-gray-100">
              <TableHead className="text-gray-600">
                <span className="flex items-center">Item</span>
              </TableHead>
              <TableHead className="text-gray-600 text-center">
                <span className="flex items-center">
                  Total Quantity
                </span>
              </TableHead>
              <TableHead className="text-gray-600">
                <span className="flex items-center">
                  Warehouse Location
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {order.cards.map(
              (order: {
                itemName: string;
                quantity: number;
                sku: string;
              }) => (
                <TableRow className="border-gray-100 hover:bg-gray-50">
                  <TableCell className="text-gray-600">
                    <span className="flex items-center">
                      {order.itemName}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600 text-center">
                    <span className="flex items-center">
                      {order.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    <span className="flex items-center">
                      Box #{order.sku}
                    </span>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
