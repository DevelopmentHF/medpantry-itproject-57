import React from 'react';
import { Button } from "@/components/ui/button";
import AuthButton from './AuthButton';
import { Separator } from './ui/separator';

interface CardProps {
  title: string;
  bgColor?: string; // Optional background color prop
  quantity: string;
  sku: string;
}

export default async function Card({ title, quantity, sku, bgColor = 'bg-card' }: CardProps) {
  return (
    <div className={`${bgColor} border-solid border-border rounded-md p-4 flex flex-col gap-2`}>
        <div className="">
            <h1 className="text-2xl">{title}</h1>
        </div>
        <Separator className='bg-secondary-foreground'></Separator>
        <div>
            <h2 className='text-card-foreground'>SKU: {sku}</h2>
            <h2 className='text-card-foreground'>Quantity: {quantity}</h2>
        </div>
        <div className='flex gap-1'>
            <Button className='bg-green-500'>Add</Button>
            <Button className='bg-red-500'>Remove</Button>
        </div>
    </div>
  );
}

