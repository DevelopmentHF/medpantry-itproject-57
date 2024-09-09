import React from 'react';
import Taskbar from './Taskbar';
import AuthButton from '@/components/AuthButton';
import Order from '@/components/Order';

export default async function Dashboard() {

    //Fetch all orders from Shopify
    let orderString: any[] = [];
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/ShopifyOrders`);
            if (!res.ok) throw new Error('Network response was not ok');
            orderString = await res.json();
            console.log(orderString);
        } catch (error) {
        console.error(error);
        return null;
      }

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
    console.log(groupedByOrderNumber["#1001"]);

  return (
    <div className="flex-1 w-full flex flex-col gap-12 items-center p-6">
      <nav className="flex gap-4 border-b border-b-foreground/10 h-16 w-full items-center">
        <AuthButton />
        <a href="../protected">Go back</a>
      </nav>
      <div className="flex w-full">
        <Taskbar />
        <div className="flex-1 p-6">
          <h1 className="font-bold text-4xl">Dashboard</h1>
        </div>
      </div>
      <div className="flex flex-wrap gap-10">
            {Object.keys(groupedByOrderNumber).map(order_number => (
                <Order key={order_number} orderNumber={order_number} cards={groupedByOrderNumber[order_number]}/>
            ))}
      </div>
    </div>
  );
}