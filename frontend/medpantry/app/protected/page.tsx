import React from 'react';
import Taskbar from './dashboard/Taskbar';
import AuthButton from '@/components/AuthButton';
import Order from '@/components/Order';
import OverviewCard from '@/components/OverviewCard';
import { Button } from '@/components/ui/button';

export default async function Dashboard() {

    // Fetch all orders from Shopify
    let orderArray: OrderData[] = []; // Define type for orderArray
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

        // Fill the array of orders and group items by orderNumber
        const orders = orderString.reduce((acc: Record<string, OrderData>, item: any) => {
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
                itemName: item.itemName,
            });
            return acc;
        }, {});

        orderArray = Object.values(orders) as OrderData[];

    } catch (error) {
        console.error("Error fetching orders:", error);
        return <div>Error fetching orders. Please try again later.</div>;
    }

    Object.keys(orderArray).forEach(order_number => {console.log(order_number)});
    //console.log(groupedByOrderNumber["#1001"]);

  return (
    <div className="flex-1 w-full flex flex-col gap-12 items-center p-6">
      <nav className="flex gap-4 border-b border-b-foreground/10 h-16 w-full items-center">
        <div className="ml-auto">
          <AuthButton />
        </div>
      </nav>
      <div className="flex">
        <div className="flex-1 p-6">
          <h1 className="font-bold text-4xl">Medical Pantry Dashboard</h1>
        </div>
      </div>

      <div className="flex w-full">
        <h1 className="text-2xl font-bold">Overview</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 w-full text-black">
        <a href="protected/current-orders">
          <OverviewCard
            title="Current Orders"
            count={Object.keys(orderArray).length}
            description="Pending orders"
          />
        </a>
        <a href="protected/manager-log">
          <OverviewCard
            title="Inventory Updates"
            count={0}
            description="Pending"
          />
        </a>
        
        <a href="protected/add-to-stock">
          <OverviewCard
            title="Stock packed"
            count={0}
            description="This week"
          />
        </a>
        
        <OverviewCard
          title="People"
          count={0}
          description="On warehouse"
        />
      </div>
    </div>
  );
}