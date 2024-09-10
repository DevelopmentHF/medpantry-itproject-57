import React from 'react';
import Taskbar from './Taskbar';
import AuthButton from '@/components/AuthButton';
import Order from '@/components/Order';
import OverviewCard from '@/components/OverviewCard';
import { Button } from '@/components/ui/button';

export default async function Dashboard() {

    //Fetch all orders from Shopify
    let orderString: any[] = [];
        try{
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/ShopifyOrders`, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache'
            }
            });
            if (!res.ok) throw new Error('Network response was not ok');
            orderString = await res.json();
            console.log("orders: " + JSON.stringify(orderString));
            
        } catch (error) {
        console.error(error);
        return null;
      }

      //console.log("ORDERS:")
      //console.log(orderString);
      
    //Group orders by order number.
    const groupedByOrderNumber = orderString.reduce((acc, item) => {
      if (!acc[item.order_number]) {
        acc[item.order_number] = []; // Initialize array for new order_number
      }
      acc[item.order_number].push({
        quantity: item.quantity,
        sku: item.sku,
      })
      return acc;
    }, {});

    Object.keys(groupedByOrderNumber).forEach(order_number => {console.log(order_number)});
    //console.log(groupedByOrderNumber["#1001"]);

  return (
    <div className="flex-1 w-full flex flex-col gap-12 items-center p-6">
      <nav className="flex gap-4 border-b border-b-foreground/10 h-16 w-full items-center">
      <Button>
            <a href="../protected">Back</a>
      </Button>
        <div className="ml-auto">
          <AuthButton />
        </div>
      </nav>
      <div className="flex w-full">
        <div className="flex-1 p-6">
          <h1 className="font-bold text-4xl">Medical Pantry Dashboard</h1>
        </div>
      </div>

      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Overview</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 w-full text-black">
        <a href="current-orders">
          <OverviewCard
            title="Current Orders"
            count={Object.keys(groupedByOrderNumber).length}
            description="Pending orders"
          />
        </a>
        
        <OverviewCard
          title="Inventory Updates"
          count={0}
          description="Pending"
        />
        <OverviewCard
          title="Packages Received"
          count={0}
          description="This week"
        />
        <OverviewCard
          title="People"
          count={0}
          description="On warehouse"
        />
      </div>
    </div>
  );
}