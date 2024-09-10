import React from 'react';
import Taskbar from './Taskbar';
import AuthButton from '@/components/AuthButton';
import Order from '@/components/Order';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

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
      <nav className="flex gap-4 border-b border-b-foreground/10 h-16 w-full items-center justify-between">
        <AuthButton />
        <Button>
          <a href="../protected">Home</a>
        </Button>
        
      </nav>
      <div className="">
        <div className='flex flex-col gap-4'>
          <h1 className="font-bold text-4xl">Dashboard</h1>
          <Taskbar />
        </div>
      </div>

      <Separator></Separator>

      <div className="flex flex-wrap gap-10">
            {Object.keys(groupedByOrderNumber).map(order_number => (
                <Order key={order_number} orderNumber={order_number} cards={groupedByOrderNumber[order_number]}/>
            ))}
      </div>
    </div>
  );
}