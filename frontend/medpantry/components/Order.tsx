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
    <div
      className={`bg-secondary-foreground border-solid border-border rounded-md p-4 flex flex-col gap-2`}
    >
      <div className="flex flex-row gap-4 w-full items-center">
        <h1 className="text-2xl font-bold">Order {orderNumber}</h1>
        <Button className="bg-red-600 hover:bg-red-700 text-card-foreground rounded-md p-2">
          Take Order
        </Button>
      </div>
      <Separator />
      {cards.map((card, index) => (
        <OrderLine
          key={card.sku}
          name="Adult Oxygen Mask"
          quantity={card.quantity}
          boxNumber={card.sku}
        />
      ))}
    </div>
  );
}
