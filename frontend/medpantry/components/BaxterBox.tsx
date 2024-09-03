import React from 'react';
import { Button } from "@/components/ui/button";
import AuthButton from './AuthButton';
import { Separator } from './ui/separator';


interface BaxterBoxProps {
  warehouseId: number;
  bgColor?: string;
  id: number;
  sku: string;
  units: number;
  isFull: boolean;
}

export default function BaxterBox({ warehouseId, id, sku, units, isFull, bgColor = 'bg-card' }: BaxterBoxProps) {

  return (  
    <div className={`${bgColor} border-solid border-border rounded-md p-4 flex flex-col gap-2`}>
        <div>
            <h2 className='text-card-foreground'>id: {id}</h2>
            <h2 className='text-card-foreground'>SKU: {sku}</h2>
            <h2 className='text-card-foreground'>warehouseId: {warehouseId}</h2>
            <h2 className='text-card-foreground'>units: {units}</h2>
            <h2 className='text-card-foreground'>is full: {isFull}</h2>
        </div>
    </div>
  );
}

