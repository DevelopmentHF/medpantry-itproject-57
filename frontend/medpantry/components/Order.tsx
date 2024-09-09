import React from 'react';
import { Button } from "@/components/ui/button";
import AuthButton from './AuthButton';
import { Separator } from './ui/separator';
import Card from '@/components/card';
import OrderLine from '@/components/OrderLine';
import BaxterBox from '@/components/BaxterBox';

interface OrderProps {
  orderNumber: string;
  cards: { quantity: string; sku: string }[];
}

async function getBoxNumber(sku: string) {
   let box: BaxterBox;
   try {
     // NEED A .env see discord
     const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/baxterbox?sku=${sku}`);
     if (!res.ok) throw new Error('Network response was not ok');
     box = await res.json();
     console.log(box);
   } catch (error) {
     console.error(error);
     notFound();
     return null;
   }
   return box.boxId;
};

export default function Order({ orderNumber, cards }: OrderProps) {

    console.log(cards.map((card, index) => card.sku));


  return (
    <div className={`bg-gray-300 text-black border-solid border-border rounded-md p-4 flex flex-col gap-2`}>
      <div className="flex flex-row gap-4 w-full">
        <h1 className="text-2xl font-bold">Order {orderNumber}</h1>
        <Button className='bg-red-600 text-white p-2'>Take Order</Button>
      </div>
      <Separator />
      {cards.map((card, index) => (
        <OrderLine
          key={card.sku}
          name="Product name"
          quantity={card.quantity}
          boxNumber={card.sku}
        />
      ))}
    </div>
  );
}