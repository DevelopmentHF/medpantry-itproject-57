import React from 'react';
import { Button } from "@/components/ui/button";
import AuthButton from './AuthButton';
import { Separator } from './ui/separator';


interface BaxterBoxProps {
  warehouseId: number;
  bgColor?: string;
  id: number;
  sku: string;
}

export default function BaxterBox({ warehouseId, id, sku, bgColor = 'bg-card' }: BaxterBoxProps) {

  return (  
    <div className={`${bgColor} border-solid border-border rounded-md p-4 flex flex-col gap-2`}>
        <div className="">
            <h1 className="text-2xl">{warehouseId}</h1>
        </div>
        <div>
            <h2 className='text-card-foreground'>SKU: {sku}</h2>
            <h2 className='text-card-foreground'>id: {id}</h2>
        </div>
    </div>
  );
}

