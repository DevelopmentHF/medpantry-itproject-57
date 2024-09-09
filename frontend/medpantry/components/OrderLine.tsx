import React from 'react';
import { Button } from "@/components/ui/button";
import AuthButton from './AuthButton';
import { Separator } from './ui/separator';

interface OrderLineProps {
  name: string;
  quantity: string;
  boxNumber: string;
}

export default function OrderLine({ name, quantity, boxNumber }: CardProps) {


  return (

    <div className={`bg-card border-solid border-border rounded-md p-4 flex flex-col gap-2`}>
        <div className="">
            <h1 className="text-2xl">x{quantity} {name}</h1>
            <h2 className='text-card-foreground'>Baxter box #{boxNumber}</h2>
        </div>
        <Separator className='bg-secondary-foreground'></Separator>
    </div>
  );
}

