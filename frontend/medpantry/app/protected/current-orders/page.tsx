import Order from "@/components/Order";
import AuthButton from "@/components/AuthButton";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import React from "react";

interface Data {
  quantity: number;
  sku: string;
  itemName: string;
}

interface OrderProps {
  orderNumber: string;
  datas: Data[];
  boxes?: number[];
}

export default async function CurrentOrders() {
  // Fetch all orders from Shopify
  let orderArray: OrderProps[] = []; 
  try {
    // Force a fresh fetch by passing timestamp
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/ShopifyOrders?timestamp=${Date.now()}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    if (!res.ok) throw new Error('Network response was not ok');
    const orderString = await res.json();

    // Validate the fetched data
    if (!Array.isArray(orderString)) {
      throw new Error('Fetched data is not an array');
    }

    // Fill the array of orders and group items by orderNumber. 
    // Note that this does not fetch the required Baxter Boxes. This will be handled later. 
    const orders = orderString.reduce((acc: Record<string, OrderProps>, item: any) => {
      if (typeof item.orderNumber !== 'string' || typeof item.quantity !== 'number' || typeof item.itemName !== 'string') {
        console.warn('Invalid item structure:', item);
        return acc;
      }

      if (!acc[item.orderNumber]) {
        acc[item.orderNumber] = {
          orderNumber: item.orderNumber,
          datas: [],
        };
      }
      acc[item.orderNumber].datas.push({
        quantity: item.quantity,
        sku: item.sku,
        itemName: item.itemName,
      });
      return acc;
    }, {});

    orderArray = Object.values(orders) as OrderProps[];

  } catch (error) {
    console.error("Error fetching orders:", error);
    return <div>Error fetching orders. Please try again later.</div>;
  }

  // Function used later to fetch the Baxter Boxes needed for each order.
  async function getBoxId(orderNumber: string): Promise<number[]> {
    // Convert # into %23 for /RequiredBaxterBoxes
    const value: string = encodeURIComponent(orderNumber);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/RequiredBaxterBoxes?orderNumber=${value}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!res.ok) throw new Error('Network response was not ok');

      const boxes = await res.json();

      // Validate the box data structure
      if (!Array.isArray(boxes)) {
        console.warn('Fetched box data is not an array:', boxes);
        return [];
      }

      return boxes.map((item: any) => item.box_id).filter((id: any) => typeof id === 'number'); // Filter invalid box IDs
    } catch (error) {
      console.error("Error fetching box IDs:", error);
      return []; 
    }
  }

  // Prepare orders with their corresponding box IDs
  const ordersWithBoxIds = await Promise.all(
    orderArray.map(async (order) => {
      const boxes = await getBoxId(order.orderNumber);
      return {
        ...order,
        boxes: boxes || [],
      };
    })
  );

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

        <div className="flex flex-wrap gap-10">
          {ordersWithBoxIds.map((order) => (
            <Order
              key={order.orderNumber}
              orderNumber={order.orderNumber}
              datas={order.datas}
              boxes={order.boxes || []}
              displayTakeOrderButton={true}
            />
          ))}
        </div>
      </div>
    </>
  );
}
