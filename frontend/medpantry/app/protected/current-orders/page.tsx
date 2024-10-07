import Order from "@/components/Order";
import AuthButton from "@/components/AuthButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/TableCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { Package } from "lucide-react";

export default async function CurrentOrders() {

    // Fetch all orders from Shopify
    let orderArray: any[] = [];
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_LINK
        }/ShopifyOrders?timestamp=${Date.now()}`,
        {
          method: "GET",
        }
      );
      if (!res.ok) throw new Error('Network response was not ok');
      const orderString = await res.json();
      console.log("orders: " + JSON.stringify(orderString));

      // Fill the array of orders and group items by orderNumber
      const orders = orderString.reduce((acc: any, item: any) => {
        if (!acc[item.orderNumber]) {
          acc[item.orderNumber] = {
            orderNumber: item.orderNumber,
            cards: []
          };
        }
        acc[item.orderNumber].cards.push({
          quantity: item.quantity,
          sku: item.sku,
          itemName: item.itemName
        });
        return acc;
      }, {});

      orderArray = Object.values(orders);
    } catch (error) {
      console.error(error);
      return null;
    }
    console.log("ORDERS ARRAY:");
    console.log(orderArray);

    return (
      <>
        <div className="flex-1 w-full flex flex-col gap-12 items-center p-6">
          <nav className="flex gap-4 border-b border-b-foreground/10 h-16 w-full items-center">
            <Button className="hover:bg-slate-200">
              <a href="../protected">Home</a>
            </Button>

            <div className="ml-auto">
              <AuthButton />
            </div>
          </nav>

          <div className="flex w-full">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Package className="mr-2 h-6 w-6 text-red-600" />
              Outstanding Orders
            </h1>
          </div>

          {orderArray.map((order) => (
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
          ))}
        </div>
      </>
    );
}
